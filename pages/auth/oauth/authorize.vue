<template>
  <n-el class="auth-box">
    <n-h1>应用授权</n-h1>
    <n-spin style="width: 100%; max-width: 500px" :show="loading.page">
      <n-card
        v-if="status === (Status.VALID || Status.WORKING)"
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
          <n-space>
            <n-button
              :loading="loading.accept"
              :disabled="loading.accept"
              type="success"
              @click="doAuthorize"
            >
              同意
            </n-button>
            <n-button
              :loading="loading.deny"
              :disabled="loading.deny"
              @click="deny"
            >
              拒绝
            </n-button>
          </n-space>
        </n-space>
        <n-divider />
        <n-el style="text-align: center">
          <n-text>
            授权后，您将被重定向到以下地址:
            <br />
            {{ params.redirectUrl }}
          </n-text>
        </n-el>
      </n-card>
      <n-card v-else>
        <n-text>无效请求，请检查 URL 参数</n-text>
      </n-card>
    </n-spin>
  </n-el>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { Client as ApiClient } from "@/api/src/client";
import {
  PostAuthorize,
  type PostAuthorizeResponse,
} from "@/api/src/api/auth/oauth/authorize.post";
import {
  GetPermissions,
  type GetPermissionsResponse,
} from "@/api/src/api/auth/oauth/permissions.get";
import { GetApp, type GetAppResponse } from "@/api/src/api/app.get";

definePageMeta({
  title: "应用授权",
  sidebar: false,
});

const mainStore = useMainStore();
const userStore = useUserStore();
const client = new ApiClient(mainStore.token!);
client.init();

const message = useMessage();
const notification = useNotification();

const route = useRoute();

let params: {
  appId: number;
  redirectUrl: string;
  scopes: string;
} = {
  appId: 0,
  redirectUrl: "",
  scopes: "",
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
  permissionRequested: Array<Permission>;
}>({
  permissionRequested: [],
});

enum Status {
  WORKING,
  ERROR,
  VALID,
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
  const rs = await client.execute<PostAuthorizeResponse>(
    new PostAuthorize({
      user_id: mainStore.userId!,
      app_id: params.appId,
      redirect_url: appData.value.redirectUrl,
      scope_ids: permissionIds,
    }),
  );
  if (rs.status === 200) {
    message.success("授权成功，正在重定向，请不要刷新浏览器");

    const urlType = getUrlType(params.redirectUrl);
    switch (urlType) {
      case UrlType.QUERY_STRING:
        if (params.redirectUrl![params.redirectUrl.length - 1] == "?") {
          window.location.href = `${params.redirectUrl}refresh_token=${rs.data.refresh_token}`;
        } else {
          window.location.href = `${params.redirectUrl}&refresh_token=${rs.data.refresh_token}`;
        }
        break;
      case UrlType.HASH: {
        const strArr = params.redirectUrl.split("#");
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
}

function deny() {
  loading.value.deny = true;
  const urlType = getUrlType(params.redirectUrl);
  switch (urlType) {
    case UrlType.QUERY_STRING:
      if (params.redirectUrl![params.redirectUrl!.length - 1] == "?") {
        window.location.href = `${params.redirectUrl}error=user.deny`;
      } else {
        window.location.href = `${params.redirectUrl}&error=user.deny`;
      }
      break;
    case UrlType.HASH: {
      const strArr = params.redirectUrl.split("#");
      window.location.href = `${strArr[0]}?error=user.deny#${strArr[1]}`;
      break;
    }
    case UrlType.NORMAL:
    default:
      window.location.href = `${params.redirectUrl}?error=user.deny`;
      break;
  }
  loading.value.deny = false;
}

onMounted(async () => {
  if (!route.query.app_id || !route.query.redirect_url || !route.query.scopes) {
    status.value = Status.ERROR;
  } else {
    params = {
      appId: Number(route.query.app_id as string),
      redirectUrl: route.query.redirect_url as string,
      scopes: route.query.scopes as string,
    };

    const reqApp = await client.execute<GetAppResponse>(
      new GetApp({
        user_id: mainStore.userId!,
        app_id: params.appId,
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

    const permissions = params.scopes.split(",");
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
