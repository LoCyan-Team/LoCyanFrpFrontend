<template>
  <n-el class="auth-box">
    <n-h1>应用授权</n-h1>
    <n-spin style="width: 100%; max-width: 500px" :show="loading.page">
      <n-card
        v-if="status === Status.WORKING || status === Status.VALID"
        :title="appData.name"
      >
        <n-text>{{ appData.description ?? "无介绍信息" }}</n-text>
        <n-divider />
        <n-text
          >确认是否要授权此应用访问您的数据？这将授予应用获取以下权限：</n-text
        >
        <n-el>
          <n-ul>
            <n-li
              v-for="permission in data.permissionRequested"
              :key="permission.id"
            >
              <n-text>{{ permission.node }}</n-text>
              <n-text style="margin-left: 1rem; float: right">
                {{ permission.description ?? "没有说明" }}
              </n-text>
            </n-li>
          </n-ul>
        </n-el>
        <n-divider />
        <n-space justify="space-between">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-avatar :src="userStore.avatar" round />
            </template>
            将以此身份继续: {{ userStore.username }}
          </n-tooltip>
          <n-button
            :loading="loading.accept"
            :disabled="loading.accept"
            type="success"
            @click="doAuthorize"
          >
            同意
          </n-button>
        </n-space>
        <n-divider />
        <n-el style="text-align: center">
          <n-text v-if="params.mode == 'CALLBACK'">
            授权后，您将被重定向到以下地址:
            <br />
            {{ params.redirectUrl }}
          </n-text>
          <n-text v-if="params.mode == 'CODE'">
            授权后，您将获得一个一次性授权代码。
          </n-text>
          <br />
          <n-text> 若您不想进行此次授权，您可以关闭此标签页。 </n-text>
        </n-el>
      </n-card>
      <n-card
        v-else-if="status === Status.AUTHORIZED_CODE"
        :title="appData.name"
      >
        <n-text>{{ appData.description ?? "无介绍信息" }}</n-text>
        <n-divider />
        <n-text>授权成功，一次性代码为:</n-text>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-code
              :code="result.code"
              @click="$copyToClipboard(result.code)"
              word-wrap
            />
          </template>
          点击复制
        </n-tooltip>
      </n-card>
      <n-card v-else title="发生错误">
        <n-text>{{ error }}</n-text>
      </n-card>
    </n-spin>
  </n-el>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import {
  PostAuthorize,
  type PostAuthorizeCallbackResponse,
  type PostAuthorizeCodeResponse,
} from "api/src/api/auth/oauth/authorize.post";
import {
  GetPermissions,
  type GetPermissionsResponse,
} from "api/src/api/auth/oauth/permissions.get";
import { GetApp, type GetAppResponse } from "api/src/api/app.get";

definePageMeta({
  sidebar: false,
});

useHead({
  title: "应用授权",
});

const mainStore = useMainStore();
const userStore = useUserStore();
const client = useApiClient();

const message = useMessage();
const notification = useNotification();

const route = useRoute();

let params: {
  appId: number | null;
  redirectUrl: string | null;
  scopes: string | null;
  mode: string | null;
} = {
  appId: 0,
  redirectUrl: null,
  scopes: "",
  mode: "",
};

const loading = ref<{
  page: boolean;
  accept: boolean;
  deny: boolean;
}>({
  page: true,
  accept: false,
  deny: false,
});

const error = ref("");

const appData = ref<{
  name: string;
  description: string | null;
  redirectUrl: string;
}>({
  name: "",
  description: null,
  redirectUrl: "",
});

interface Permission {
  id: number;
  node: string;
  description: string | null;
}

const data = ref<{
  permissionRequested: Permission[];
}>({
  permissionRequested: [],
});

const result = ref<{
  code: string;
}>({
  code: "",
});

enum Status {
  WORKING,
  ERROR,
  VALID,
  AUTHORIZED_CODE,
}

const status = ref<Status>(Status.WORKING);

enum UrlType {
  QUERY_STRING,
  HASH,
  NORMAL,
}

function getUrlType(url: string): UrlType {
  if (url.includes("?")) {
    return UrlType.QUERY_STRING;
  } else if (url.includes("#")) {
    return UrlType.HASH;
  } else {
    return UrlType.NORMAL;
  }
}

async function doAuthorize() {
  loading.value.accept = true;
  const permissionIds: number[] = [];
  data.value.permissionRequested.forEach((permission) => {
    permissionIds.push(permission.id);
  });
  let rs;
  switch (params.mode) {
    case "callback": {
      rs = await client.execute<PostAuthorizeCallbackResponse>(
        new PostAuthorize({
          user_id: mainStore.userId!,
          app_id: params.appId!,
          redirect_url: params.redirectUrl!,
          scope_ids: permissionIds,
          mode: "CALLBACK",
        }),
      );
      if (rs.status === 200) {
        message.success("授权成功，正在重定向，请不要刷新浏览器");

        const urlType = getUrlType(params.redirectUrl!);
        switch (urlType) {
          case UrlType.QUERY_STRING:
            if (params.redirectUrl![params.redirectUrl!.length - 1] == "?") {
              window.location.href = `${params.redirectUrl}refresh_token=${rs.data.refresh_token}`;
            } else {
              window.location.href = `${params.redirectUrl}&refresh_token=${rs.data.refresh_token}`;
            }
            break;
          case UrlType.HASH: {
            const strArr = params.redirectUrl!.split("#");
            window.location.href = `${strArr[0]}?refresh_token=${rs.data.refresh_token}#${strArr[1]}`;
            break;
          }
          case UrlType.NORMAL:
          default:
            window.location.href = `${params.redirectUrl}?refresh_token=${rs.data.refresh_token}`;
            break;
        }
      } else if (rs.status === 403) {
        notification.error({
          title: "授权失败",
          content: `服务器拒绝授权，原因: ${rs.message}`,
          duration: 2500,
        });
      } else message.error(rs.message);
      loading.value.accept = false;
      break;
    }
    case "code": {
      rs = await client.execute<PostAuthorizeCodeResponse>(
        new PostAuthorize({
          user_id: mainStore.userId!,
          app_id: params.appId!,
          scope_ids: permissionIds,
          mode: "CODE",
        }),
      );
      if (rs.status === 200) {
        result.value.code = rs.data.code;
        status.value = Status.AUTHORIZED_CODE;
      } else if (rs.status === 403) {
        notification.error({
          title: "授权失败",
          content: `服务器拒绝授权，原因: ${rs.message}`,
          duration: 2500,
        });
      } else message.error(rs.message);
      loading.value.accept = false;
      break;
    }
    default:
      message.error("未知的授权模式，请检查传入参数");
      return;
  }
}

onMounted(async () => {
  params = {
    appId: route.query.client_id
      ? Number(route.query.client_id as string)
      : null,
    redirectUrl: route.query.redirect_uri as string | null,
    scopes: route.query.scopes as string,
    mode: route.query.mode as string,
  };

  if (!params.appId || !params.scopes || !params.mode) {
    error.value = "传入参数不完整或无效";
    status.value = Status.ERROR;
  } else {
    switch (params.mode) {
      case "code":
        // code 模式检查
        break;
      case "callback":
        // callback 模式检查
        if (!params.redirectUrl) {
          error.value = "传入参数不完整或无效";
          status.value = Status.ERROR;
          loading.value.page = false;
          return;
        }
        break;
      default:
        error.value = "未知授权模式";
        status.value = Status.ERROR;
        loading.value.page = false;
        return;
    }

    const reqApp = await client.execute<GetAppResponse>(
      new GetApp({
        user_id: mainStore.userId!,
        app_id: params.appId!,
      }),
    );
    if (reqApp.status === 200) {
      appData.value = {
        name: reqApp.data.name,
        description: reqApp.data.description ?? null,
        redirectUrl: reqApp.data.redirect_url,
      };
    } else {
      message.error(reqApp.message);
      error.value = "请求应用数据失败";
      status.value = Status.ERROR;
      loading.value.page = false;
      return;
    }

    const permissionList: Permission[] = [];
    const reqPermission = await client.execute<GetPermissionsResponse>(
      new GetPermissions({
        user_id: mainStore.userId!,
      }),
    );
    if (reqPermission.status === 200) {
      reqPermission.data.list.forEach((it) => {
        permissionList.push({
          id: it.id,
          node: it.node,
          description: it.description,
        });
      });
    } else {
      message.error(reqPermission.message);
      return;
    }

    const permissions = params.scopes!.split(",");
    permissionList.forEach((permission) => {
      if (permissions.includes(permission.node))
        data.value.permissionRequested.push(permission);
    });

    status.value = Status.VALID;
  }
  loading.value.page = false;
});
</script>

<style scoped>
.auth-box {
  flex: 1;
  width: 100%;
  margin-inline: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-block: 0.5rem;
}

@media screen and (max-width: 500px) {
  .auth-box {
    margin-inline: 0.5rem;
  }
}
</style>
