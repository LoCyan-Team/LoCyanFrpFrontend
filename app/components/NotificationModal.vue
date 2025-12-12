<template>
  <n-tabs type="line" default-value="system" animated>
    <n-tab-pane name="system" tab="系统消息">
      <n-spin :show="loading">
        <n-empty v-if="systemNotificationData.length === 0" />
        <n-el v-else>
          <n-scrollbar style="max-height: 60dvh">
            <n-list hoverable>
              <n-list-item
                v-for="notification in systemNotificationData"
                :key="notification.id"
              >
                <n-badge style="width: 100%" :show="!notification.readTime" dot>
                  <n-thing style="width: 100%" :title="notification.title">
                    <template #header-extra>
                      <n-space align="center">
                        <n-button
                          v-if="!notification.readTime"
                          size="small"
                          @click="handleSystemMarkAsRead(notification.id)"
                        >
                          已读
                        </n-button>
                        <n-text>{{
                          dayjs(notification.time).format("L LT")
                        }}</n-text>
                      </n-space>
                    </template>
                    {{ notification.content }}
                  </n-thing>
                </n-badge>
              </n-list-item>
            </n-list>
          </n-scrollbar>
          <n-divider />
          <n-space align="center">
            <n-popconfirm @positive-click="handleSystemMarkPageRead">
              <template #trigger>
                <n-button type="success" secondary>本页已读</n-button>
              </template>
              确定要全部已读吗？此操作不可撤销。
            </n-popconfirm>
            <n-pagination
              v-model:page="systemPage.current"
              :page-count="systemPage.count"
              :on-update:page="
                (pageSel) => {
                  systemPage.current = pageSel;
                  getSystemNotifications();
                }
              "
            />
          </n-space>
        </n-el>
      </n-spin>
    </n-tab-pane>
    <n-tab-pane name="user" tab="用户消息">
      <n-spin :show="loading">
        <n-empty v-if="userNotificationData.length === 0" />
        <n-el v-else>
          <n-scrollbar style="max-height: 60dvh">
            <n-list hoverable>
              <n-list-item
                v-for="notification in userNotificationData"
                :key="notification.id"
              >
                <n-badge style="width: 100%" :show="!notification.readTime" dot>
                  <n-thing style="width: 100%" :title="notification.title">
                    <template #header-extra>
                      <n-space align="center">
                        <n-button
                          v-if="!notification.readTime"
                          size="small"
                          @click="handleUserMarkAsRead(notification.id)"
                        >
                          已读
                        </n-button>
                        <n-text>{{
                          dayjs(notification.time).format("L LT")
                        }}</n-text>
                      </n-space>
                    </template>
                    {{ notification.content }}
                  </n-thing>
                </n-badge>
              </n-list-item>
            </n-list>
          </n-scrollbar>
          <n-divider />
          <n-space align="center">
            <n-popconfirm @positive-click="handleUserMarkPageRead">
              <template #trigger>
                <n-button type="success" secondary>本页已读</n-button>
              </template>
              确定要全部已读吗？此操作不可撤销。
            </n-popconfirm>
            <n-pagination
              v-model:page="userPage.current"
              :page-count="userPage.count"
              :on-update:page="
                (pageSel) => {
                  userPage.current = pageSel;
                  getUserNotifications();
                }
              "
            />
          </n-space>
        </n-el>
      </n-spin>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import {
  GetSystem,
  type GetSystemResponse,
} from "api/src/api/site/notification/system.get";
import {
  GetUser,
  type GetUserResponse,
} from "api/src/api/site/notification/user.get";
import { PutRead as PutSystemRead } from "api/src/api/site/notification/system/read.put";
import { PutBatch as PutSystemReadBatch } from "api/src/api/site/notification/system/read/batch.put";
import { PutRead as PutUserRead } from "api/src/api/site/notification/user/read.put";
import { PutBatch as PutUserReadBatch } from "api/src/api/site/notification/user/read/batch.put";

const dayjs = useDayjs();

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();

const loading = ref<boolean>(true);

interface SystemNotification {
  id: number;
  title: string;
  content: string;
  time: string;
  readTime: string | null;
}
interface UserNotification {
  id: number;
  title: string;
  content: string;
  time: string;
  readTime: string | null;
}

const systemNotificationData = ref<SystemNotification[]>([]),
  userNotificationData = ref<UserNotification[]>([]);

const systemPage = ref<{
    current: number;
    count: number;
  }>({
    current: 1,
    count: 1,
  }),
  userPage = ref<{
    current: number;
    count: number;
  }>({
    current: 1,
    count: 1,
  });

async function handleSystemMarkAsRead(notificationId: number) {
  const rs = await client.execute(
    new PutSystemRead({
      user_id: mainStore.userId!,
      notification_id: notificationId,
    }),
  );
  if (rs.status === 200) {
    const time = dayjs().format();
    systemNotificationData.value.forEach((notification) => {
      if (notification.id === notificationId) {
        notification.readTime = time;
      }
    });
  } else message.error(rs.message);
}

async function handleSystemMarkPageRead() {
  const rs = await client.execute(
    new PutSystemReadBatch({
      user_id: mainStore.userId!,
      page: systemPage.value.current,
      size: 15,
    }),
  );
  if (rs.status === 200) {
    const time = dayjs().format();
    systemNotificationData.value.forEach((notification) => {
      notification.readTime = time;
    });
  } else message.error(rs.message);
}

async function handleUserMarkAsRead(notificationId: number) {
  const rs = await client.execute(
    new PutUserRead({
      user_id: mainStore.userId!,
      notification_id: notificationId,
    }),
  );
  if (rs.status === 200) {
    const time = dayjs().format();
    userNotificationData.value.forEach((notification) => {
      if (notification.id === notificationId) {
        notification.readTime = time;
      }
    });
  } else message.error(rs.message);
}

async function handleUserMarkPageRead() {
  const rs = await client.execute(
    new PutUserReadBatch({
      user_id: mainStore.userId!,
      page: systemPage.value.current,
      size: 15,
    }),
  );
  if (rs.status === 200) {
    const time = dayjs().format();
    userNotificationData.value.forEach((notification) => {
      notification.readTime = time;
    });
  } else message.error(rs.message);
}

async function getSystemNotifications() {
  const rs = await client.execute<GetSystemResponse>(
    new GetSystem({
      user_id: mainStore.userId!,
      page: systemPage.value.current,
      size: 15,
    }),
  );
  if (rs.status === 200) {
    if (
      systemPage.value.current > rs.data.pagination.count &&
      rs.data.pagination.count > 0
    ) {
      systemPage.value.current = rs.data.pagination.count;
      await getSystemNotifications();
      return;
    }
    systemPage.value.count = rs.data.pagination.count;

    rs.data.list
      .slice()
      .sort(
        (a, b) =>
          dayjs(a.create_time).valueOf() - dayjs(b.create_time).valueOf(),
      )
      .forEach((it) => {
        systemNotificationData.value.push({
          id: it.id,
          title: it.title,
          content: it.content,
          time: it.create_time,
          readTime: it.read_time,
        });
      });
  } else message.error(rs.message);
}

async function getUserNotifications() {
  const rs = await client.execute<GetUserResponse>(
    new GetUser({
      user_id: mainStore.userId!,
      page: userPage.value.current,
      size: 15,
    }),
  );
  if (rs.status === 200) {
    if (
      userPage.value.current > rs.data.pagination.count &&
      rs.data.pagination.count > 0
    ) {
      userPage.value.current = rs.data.pagination.count;
      await getUserNotifications();
      return;
    }
    userPage.value.count = rs.data.pagination.count;

    rs.data.list
      .slice()
      .sort(
        (a, b) =>
          dayjs(a.create_time).valueOf() - dayjs(b.create_time).valueOf(),
      )
      .forEach((it) => {
        userNotificationData.value.push({
          id: it.id,
          title: it.title,
          content: it.content,
          time: it.create_time,
          readTime: it.read_time,
        });
      });
  } else message.error(rs.message);
}

onMounted(async () => {
  await getSystemNotifications();
  await getUserNotifications();
  loading.value = false;
});
</script>
