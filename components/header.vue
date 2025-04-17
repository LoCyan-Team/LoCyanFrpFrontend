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
      <n-button
        circle
        style="margin-top: 15px; margin-right: 10px"
        @click="
          () => {
            // TODO
          }
        "
      >
        <template #icon>
          <n-icon><MdNotifications /></n-icon>
        </template>
      </n-button>
      <n-dropdown :options="avatarOptions" @select="handleAvatarOptionSelect">
        <n-avatar
          round
          size="medium"
          style="margin-top: 15px; margin-right: 23px"
        />
        <!--:src="avatar"-->
        <!--v-show="userData.getters.get_token !== '' && userData.getters.get_token !== null"-->
      </n-dropdown>
    </n-space>
  </n-space>
</template>

<script setup>
import { MdNotifications } from "@vicons/ionicons4";
import { PersonCircleOutline, LogOutOutline } from "@vicons/ionicons5";

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

function handleAvatarOptionSelect(key) {
  switch (key) {
    case "profile":
      break;
    case "logout":
  }
}
</script>
