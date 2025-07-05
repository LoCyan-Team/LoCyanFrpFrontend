<template>
  <page-content title="授权管理">
    <n-spin :show="loading">
      <n-space vertical>
        <n-empty
          v-if="authorizations.length === 0"
          description="暂无授权应用"
          style="margin-top: 24px"
        />
        <n-el v-else>
          <n-card
            v-for="auth in authorizations"
            :key="auth.appId"
            :title="auth.appName"
            style="margin-bottom: 16px"
          >
            <n-tabs
              type="line"
              default-value="app"
              animated
              :on-before-leave="
                (val, _): boolean => {
                  switch (val) {
                    case 'sessions':
                      getAppSessions(auth.appId);
                      return true;
                    default:
                      return true;
                  }
                }
              "
            >
              <n-tab-pane name="app" tab="应用信息">
                <n-text> 介绍: {{ auth.appDescription ?? "无" }} </n-text>
                <br />
                <n-space align="center">
                  <n-text>已授权权限:</n-text>
                  <n-tooltip
                    v-for="perm in auth.authorizedPermissions"
                    :key="perm"
                  >
                    <template #trigger>
                      <n-tag type="info" bordered>
                        {{ findPermission(perm).node }}
                      </n-tag>
                    </template>
                    {{ findPermission(perm).description ?? "没有说明" }}
                  </n-tooltip>
                </n-space>
              </n-tab-pane>
              <n-tab-pane name="sessions" tab="应用授权">
                <n-spin :show="sessionLoading.includes(auth.appId)">
                  <n-space vertical>
                    <n-empty v-if="findAppSessions(auth.appId).length === 0" />
                    <n-el v-else>
                      <n-list hoverable>
                        <n-list-item
                          v-for="session in findAppSessions(auth.appId)"
                          :key="session.refreshToken"
                        >
                          <n-text>
                            <n-space align="center">
                              <n-text>刷新令牌:</n-text>
                              <n-tooltip trigger="click">
                                <template #trigger>
                                  <n-button
                                    type="success"
                                    size="small"
                                    secondary
                                  >
                                    点击显示
                                  </n-button>
                                </template>
                                <n-scrollbar x-scrollable>
                                  <n-code :code="session.refreshToken" />
                                </n-scrollbar>
                              </n-tooltip>
                              <n-button
                                type="info"
                                size="small"
                                secondary
                                @click="$copyToClipboard(session.refreshToken)"
                              >
                                点击复制
                              </n-button>
                            </n-space>
                          </n-text>
                          <n-text>
                            授权时间:
                            {{ dayjs(session.authorizeTime).format("L LT") }}
                          </n-text>
                          <template #suffix>
                            <n-popconfirm
                              @positive-click="
                                handleRevokeSessionAuthorize(
                                  auth.appId,
                                  session.refreshToken,
                                )
                              "
                            >
                              <template #trigger>
                                <n-button type="error" secondary>
                                  撤销授权
                                </n-button>
                              </template>
                              确定要撤销授权吗？撤销后您需要重新授权。
                            </n-popconfirm>
                          </template>
                        </n-list-item>
                      </n-list>
                    </n-el>
                    <n-space
                      v-if="findAppSessions(auth.appId).length !== 0"
                      justify="center"
                      style="width: 100%"
                    >
                      <n-pagination
                        v-model:page="findAppSessionPage(auth.appId).current"
                        v-model:page-size="findAppSessionPage(auth.appId).size"
                        :page-count="findAppSessionPage(auth.appId).count"
                        :on-update:page="
                          (pageSel) => {
                            updateAppSessionPage(auth.appId, {
                              current: pageSel,
                            });
                            getAppSessions(auth.appId);
                          }
                        "
                        :on-update:page-size="
                          (pageSizeSel) => {
                            updateAppSessionPage(auth.appId, {
                              size: pageSizeSel,
                            });
                            getAppSessions(auth.appId);
                          }
                        "
                        show-size-picker
                        :page-sizes="[10, 25, 50, 100]"
                      />
                    </n-space>
                  </n-space>
                </n-spin>
              </n-tab-pane>
            </n-tabs>
            <template #action>
              <n-space>
                <n-popconfirm
                  @positive-click="handleRevokeAppAuthorize(auth.appId)"
                >
                  <template #trigger>
                    <n-button type="error"> 撤销授权 </n-button>
                  </template>
                  确定要撤销授权吗？撤销后您需要重新授权。
                </n-popconfirm>
              </n-space>
            </template>
          </n-card>
        </n-el>
        <n-space
          v-if="authorizations.length !== 0"
          justify="center"
          style="width: 100%"
        >
          <n-pagination
            v-model:page="authorizationPage.current"
            v-model:page-size="authorizationPage.size"
            :page-count="authorizationPage.count"
            :on-update:page="
              (pageSel) => {
                authorizationPage.current = pageSel;
                getAuthorizations();
              }
            "
            :on-update:page-size="
              (pageSizeSel) => {
                authorizationPage.size = pageSizeSel;
                getAuthorizations();
              }
            "
            show-size-picker
            :page-sizes="[10, 25, 50, 100]"
          />
        </n-space>
      </n-space>
    </n-spin>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import {
  GetAuthorizations,
  type GetAuthorizationsResponse,
} from "@/api/src/api/auth/oauth/authorizations.get";
import {
  GetPermissions,
  type GetPermissionsResponse,
} from "@/api/src/api/auth/oauth/permissions.get";
import {
  GetSessions,
  type GetSessionsResponse,
} from "@/api/src/api/auth/oauth/authorization/sessions.get";
import { DeleteSession } from "@/api/src/api/auth/oauth/authorization/session.delete";
import { DeleteApp as DeleteAppAuthorization } from "@/api/src/api/auth/oauth/authorization/app.delete";

const dayjs = useDayjs();

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();

definePageMeta({
  title: "授权管理",
});

const loading = ref(true),
  sessionLoading = ref<number[]>([]);

interface Authorization {
  appId: number;
  appName: string;
  appDescription: string;
  authorizedPermissions: Array<number>;
}

interface AuthSession {
  appId: number;
  refreshToken: string;
  authorizeTime: string;
}

const authorizations = ref<Authorization[]>([]);
const sessions = ref<AuthSession[]>([]);

const permissions: Array<{
  id: number;
  node: string;
  description: string | null;
}> = [];

const authorizationPage = ref<{
    current: number;
    size: number;
    count: number;
  }>({
    current: 1,
    size: 10,
    count: 1,
  }),
  sessionPages = ref<
    Array<{
      appId: number;
      current: number;
      size: number;
      count: number;
    }>
  >([]);

function findPermission(permId: number) {
  return permissions.filter((permission) => permission.id === permId)[0];
}

function findAppSessions(appId: number) {
  return sessions.value.filter((session) => session.appId === appId);
}

function findAppSessionPage(appId: number) {
  return sessionPages.value.filter((page) => page.appId === appId)[0];
}

function updateAppSessionPage(
  appId: number,
  page: {
    current?: number;
    size?: number;
    count?: number;
  },
) {
  const old = findAppSessionPage(appId);
  const newArr = sessionPages.value.filter((page) => page.appId !== appId);
  newArr.push({
    appId: appId,
    current: page.current ?? old.current,
    size: page.size ?? old.size,
    count: page.count ?? old.count,
  });
  sessionPages.value = newArr;
}

async function handleRevokeAppAuthorize(appId: number) {
  const rs = await client.execute(
    new DeleteAppAuthorization({
      user_id: mainStore.userId!,
      app_id: appId,
    }),
  );
  if (rs.status === 200) {
    authorizations.value = authorizations.value.filter(
      (authorizations) => authorizations.appId !== appId,
    );
  } else message.error(rs.message);
}

async function handleRevokeSessionAuthorize(appId: number, sessionId: string) {
  const rs = await client.execute(
    new DeleteSession({
      user_id: mainStore.userId!,
      app_id: appId,
      session_id: sessionId,
    }),
  );
  if (rs.status === 200) {
    sessions.value = sessions.value.filter(
      (session) => session.refreshToken !== sessionId,
    );
  } else message.error(rs.message);
}

async function getPermissions() {
  const rs = await client.execute<GetPermissionsResponse>(
    new GetPermissions({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    rs.data.list.forEach((item) => {
      permissions.push(item);
    });
  } else message.error(rs.message);
}

async function getAuthorizations() {
  loading.value = true;
  const rs = await client.execute<GetAuthorizationsResponse>(
    new GetAuthorizations({
      user_id: mainStore.userId!,
      page: authorizationPage.value.current,
      size: authorizationPage.value.size,
    }),
  );
  if (rs.status === 200) {
    authorizationPage.value.count = rs.data.pagination.count;
    rs.data.list.forEach((it) => {
      authorizations.value.push({
        appId: it.app_id,
        appName: it.app_name,
        appDescription: it.app_description,
        authorizedPermissions: it.authorized_permissions,
      });
    });
  } else message.error(rs.message);
  loading.value = false;
}

async function getAppSessions(appId: number) {
  sessionLoading.value.push(appId);
  let page = findAppSessionPage(appId);
  if (page === undefined) {
    sessionPages.value.push({
      appId: appId,
      current: 1,
      size: 10,
      count: 1,
    });
    page = {
      appId: appId,
      current: 1,
      size: 10,
      count: 1,
    };
  }
  const rs = await client.execute<GetSessionsResponse>(
    new GetSessions({
      user_id: mainStore.userId!,
      app_id: appId,
      page: page.current,
      size: page.size,
    }),
  );
  if (rs.status === 200) {
    sessions.value.length = 0;
    rs.data.list.forEach((it) => {
      sessions.value.push({
        appId: appId,
        refreshToken: it.refresh_token,
        authorizeTime: it.authorize_time,
      });
    });
  } else message.error(rs.message);
  sessionLoading.value = sessionLoading.value.filter((it) => it !== appId);
}

onMounted(async () => {
  await getPermissions();
  await getAuthorizations();
});
</script>
