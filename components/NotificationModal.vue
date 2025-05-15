<template>
  <n-tabs type="line" default-value="system" animated>
    <n-tab-pane name="system" tab="系统消息">
      <n-empty v-if="systemNotificationData.length === 0" />
      <n-el v-else>
        <n-scrollbar style="max-height: 60dvh">
          <n-list hoverable>
            <n-list-item
              v-for="notification in systemNotificationData"
              :key="notification.id"
            >
              <n-badge
                style="width: 100%"
                :value="renderRead(notification.readTime)"
                dot
              >
                <n-thing
                  style="width: 100%"
                  :title="notification.title"
                  :title-extra="dayjs(notification.time).format('L LT')"
                >
                  {{ notification.content }}
                  <template #action>
                    <n-button size="small"> 已读 </n-button>
                  </template>
                </n-thing>
              </n-badge>
            </n-list-item>
          </n-list>
        </n-scrollbar>
        <n-divider />
        <n-popconfirm>
          <template #trigger>
            <n-button>全部已读</n-button>
          </template>
          确定要全部已读吗？此操作不可撤销。
        </n-popconfirm>
      </n-el>
    </n-tab-pane>
    <n-tab-pane name="user" tab="用户消息">
      <n-empty v-if="userNotificationData.length === 0" />
      <n-el v-else>
        <n-scrollbar style="max-height: 60dvh">
          <n-list>
            <n-list-item
              v-for="notification in userNotificationData"
              :key="notification.id"
            >
              <n-badge
                style="width: 100%"
                :value="renderRead(notification.readTime)"
                dot
              >
                <n-thing
                  style="width: 100%"
                  :title="notification.title"
                  :title-extra="dayjs(notification.time).format('L LT')"
                >
                  {{ notification.content }}
                  <template #action>
                    <n-button size="small"> 已读 </n-button>
                  </template>
                </n-thing>
              </n-badge>
            </n-list-item>
          </n-list>
        </n-scrollbar>
        <n-divider />
        <n-popconfirm>
          <template #trigger>
            <n-button>全部已读</n-button>
          </template>
          确定要全部已读吗？此操作不可撤销。
        </n-popconfirm>
      </n-el>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
const dayjs = useDayjs();

const systemNotificationData = ref<
    {
      id: number;
      title: string;
      content: string;
      time: string;
      readTime: string | null;
    }[]
  >([
    // {
    //   id: 1,
    //   title: "测试",
    //   content: "这里有很多很多的内容可以写",
    //   time: dayjs().format("L LT"),
    //   readTime: null,
    // },
    // {
    //   id: 1,
    //   title: "测试",
    //   content:
    //     "长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长文本",
    //   time: dayjs().format("L LT"),
    //   readTime: null,
    // },
  ]),
  userNotificationData = ref<
    {
      id: number;
      title: string;
      content: string;
      time: string;
      readTime: string | null;
    }[]
  >([]);

function renderRead(time: string | null): number {
  return time === null ? 0 : 1;
}
</script>
