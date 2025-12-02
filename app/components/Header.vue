<template>
  <n-space
    justify="space-between"
    style="display: flex; align-items: center; flex-wrap: nowrap"
  >
    <n-thing>
      <nuxt-link to="/">
        <n-gradient-text :size="24" type="warning" style="margin-left: 20px">
          LoCyanFrp
        </n-gradient-text>
      </nuxt-link>
    </n-thing>
    <n-space style="height: 60px" class="menu">
      <client-only>
        <n-button
          v-show="useLoggedIn()"
          circle
          style="margin-top: 15px; margin-right: 10px"
          @click="() => (showNotification = true)"
        >
          <template #icon>
            <n-icon><MdNotifications /></n-icon>
          </template>
        </n-button>
      </client-only>
      <client-only>
        <n-dropdown :options="avatarOptions" @select="handleAvatarOptionSelect">
          <n-avatar
            v-show="useLoggedIn()"
            round
            size="medium"
            style="margin-top: 15px; margin-right: 23px"
            :src="userStore.avatar"
          />
        </n-dropdown>
      </client-only>
    </n-space>
  </n-space>
  <n-modal
    v-model:show="showUserInfo"
    preset="card"
    title="用户资料"
    size="huge"
    :bordered="false"
    style="max-width: 600px"
  >
    <user-info @logout="handleUserInfoModalLogout" />
  </n-modal>
  <n-modal
    v-model:show="showNotification"
    preset="card"
    title="通知"
    size="huge"
    :bordered="false"
    style="max-width: 600px"
  >
    <notification-modal />
  </n-modal>
</template>

<script setup>
import MdNotifications from "@vicons/ionicons4/MdNotifications";
import PersonCircleOutline from "@vicons/ionicons5/PersonCircleOutline";
import LogOutOutline from "@vicons/ionicons5/LogOutOutline";
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";

import { DeleteToken } from "api/src/api/user/token.delete";

const mainStore = useMainStore();
const userStore = useUserStore();

const notification = useNotification();

const avatarOptions = [
  {
    label: "用户资料",
    key: "profile",
    icon: renderIcon(PersonCircleOutline),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogOutOutline),
  },
];

const showUserInfo = ref(false);
const showNotification = ref(false);

function handleUserInfoModalLogout() {
  showUserInfo.value = false;
  handleLogout();
}

function handleLogout() {
  mainStore.$reset();
  userStore.$reset();
  notification.success({
    title: "已登出",
    content: "已登出，感谢您的使用。",
    duration: 2500,
  });
  navigateTo("/auth/login");
}

async function handleAvatarOptionSelect(key) {
  switch (key) {
    case "profile":
      showUserInfo.value = true;
      break;
    case "logout": {
      const client = useApiClient();
      const rs = await client.execute(
        new DeleteToken({
          user_id: mainStore.userId,
        }),
      );
      if (rs.status !== 200) {
        notification.warning({
          title: "吊销会话时发生了异常",
          content: `在吊销本会话时发生了异常，会话将会在过期后吊销。若您希望立即吊销此会话，请重新登录后手动吊销全部会话。响应信息：${rs.message}`,
          duration: 2500,
        });
      }
      handleLogout();
    }
  }
}
</script>
