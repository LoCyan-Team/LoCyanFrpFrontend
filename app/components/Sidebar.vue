<template>
  <n-layout-sider id="sider" bordered show-trigger :collapsed="collapsed" collapse-mode="width" :collapsed-width="64"
    :native-scrollbar="false" style="height: 100%; bottom: 0" @collapse="collapsed = true" @expand="collapsed = false">
    <client-only>
      <n-menu ref="menuInstRef" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
        :options="menuOptions" style="" :value="activeKey" @update:value="handleUpdateValue" />
    </client-only>
  </n-layout-sider>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";

import Add from "@vicons/ionicons5/Add";
import BookOutline from "@vicons/ionicons5/BookOutline";
import CloudDownloadOutline from "@vicons/ionicons5/CloudDownloadOutline";
import FileTrayFull from "@vicons/ionicons5/FileTrayFull";
import List from "@vicons/ionicons5/List";
import PaperPlane from "@vicons/ionicons5/PaperPlane";
import PencilSharp from "@vicons/ionicons5/PencilSharp";
import Person from "@vicons/ionicons5/Person";
import CompassSharp from "@vicons/ionicons5/CompassSharp";
import GameController from "@vicons/ionicons5/GameController";
import LogInOutline from "@vicons/ionicons5/LogInOutline";
import MailOpenOutline from "@vicons/ionicons5/MailOpenOutline";
import GuiManagement from "@vicons/carbon/GuiManagement";
import Api from "@vicons/carbon/Api";
import ContentDeliveryNetwork from "@vicons/carbon/ContentDeliveryNetwork";
import MoreCircle20Filled from "@vicons/fluent/MoreCircle20Filled";
import Box24Filled from "@vicons/fluent/Box24Filled";
import KeyReset20Regular from "@vicons/fluent/KeyReset20Regular";
import CommentMultiple16Regular from "@vicons/fluent/CommentMultiple16Regular";
import AttachMoneyFilled from "@vicons/material/AttachMoneyFilled";
import AccountTreeOutlined from "@vicons/material/AccountTreeOutlined";
import AccountBalanceWalletFilled from "@vicons/material/AccountBalanceWalletFilled";
import VerifiedOutlined from "@vicons/material/VerifiedOutlined";
import Gift from "@vicons/ionicons5/Gift";
import LocalActivityFilled from "@vicons/material/LocalActivityFilled";
import MessageFilled from "@vicons/material/MessageFilled";

import { usePageStore } from "@/store/page";

const pageStore = usePageStore();

const pageSidebarMode = computed(() => pageStore.sidebarMode);

const guestMenuOptions: MenuOption[] = [
  {
    path: "/auth/login",
    label: "登录",
    key: "login",
    icon: renderIcon(LogInOutline),
  },
  {
    path: "/auth/register",
    label: "注册",
    key: "register",
    icon: renderIcon(MailOpenOutline),
  },
  {
    path: "/auth/reset-password",
    label: "重置密码",
    key: "password-reset",
    icon: renderIcon(KeyReset20Regular),
  },
];

const loggedInMenuOptions: MenuOption[] = [
  {
    path: "/dashboard",
    label: "仪表盘",
    key: "dashboard",
    icon: renderIcon(CompassSharp),
  },
  {
    path: "/verification",
    label: "身份认证",
    key: "verification",
    icon: renderIcon(Person),
  },
  {
    path: "/sign",
    label: "签到",
    key: "sign",
    icon: renderIcon(PencilSharp),
  },
  {
    label: "跨年活动",
    key: "yearly-event",
    icon: renderIcon(LocalActivityFilled),
    children: [
      {
        path: "/activity/message",
        label: "新年祝福",
        key: "message",
        icon: renderIcon(MessageFilled),
      },
      {
        path: "/activity/prize",
        label: "抽奖",
        key: "prize",
        icon: renderIcon(Gift),
      },
    ],
  },
  {
    label: "隧道",
    key: "tunnel",
    icon: renderIcon(PaperPlane),
    children: [
      {
        path: "/tunnel/manage",
        label: "隧道管理",
        key: "tunnel-manage",
        icon: renderIcon(List),
      },
      {
        path: "/tunnel/create",
        label: "创建隧道",
        key: "tunnel-create",
        icon: renderIcon(Add),
      },
      {
        path: "/tunnel/config",
        label: "配置文件",
        key: "tunnel-config",
        icon: renderIcon(FileTrayFull),
      },
    ],
  },
  {
    label: "捐赠",
    key: "donate",
    icon: renderIcon(AccountBalanceWalletFilled),
    children: [
      {
        path: "/donate",
        label: "捐赠",
        key: "donate-donate",
        icon: renderIcon(AttachMoneyFilled),
      },
      {
        path: "/donate/comment",
        label: "留言",
        key: "donate-comment",
        icon: renderIcon(CommentMultiple16Regular),
      },
    ],
  },
  {
    label: "域名",
    key: "domain",
    icon: renderIcon(ContentDeliveryNetwork),
    children: [
      {
        path: "/domain/verification",
        label: "所有权验证",
        key: "domain-verification",
        icon: renderIcon(VerifiedOutlined),
      },
      {
        path: "/domain/icp",
        label: "ICP 备案白名单",
        key: "domain-icp",
        icon: renderIcon(List),
      },
    ],
  },
  {
    label: "游戏联机",
    key: "game",
    icon: renderIcon(GameController),
    children: [
      {
        path: "/game/minecraft",
        label: "Minecraft",
        key: "game-minecraft",
        icon: renderIcon(AccountTreeOutlined),
      },
    ],
  },
  {
    label: "应用程序",
    key: "apps",
    icon: renderIcon(Box24Filled),
    children: [
      {
        path: "/app/manage",
        label: "应用管理",
        key: "app-manage",
        icon: renderIcon(GuiManagement),
      },
      {
        path: "/app/create",
        label: "创建应用",
        key: "app-create",
        icon: renderIcon(Add),
      },
      {
        path: "/app/access",
        label: "授权管理",
        key: "app-access",
        icon: renderIcon(Api),
      },
    ],
  },
  {
    label: "其他功能",
    key: "other",
    icon: renderIcon(MoreCircle20Filled),
    children: [
      {
        label: () =>
          h(
            "a",
            {
              href: "https://status.locyanfrp.cn",
              target: "_blank",
            },
            "服务状态",
          ),
        key: "other-status",
        icon: renderIcon(List),
      },
      {
        path: "/other/software",
        label: "软件下载",
        key: "other-software",
        icon: renderIcon(CloudDownloadOutline),
      },
      {
        label: () =>
          h(
            "a",
            {
              href: "https://docs.locyanfrp.cn",
              target: "_blank",
            },
            "帮助文档",
          ),
        key: "other-help-document",
        icon: renderIcon(BookOutline),
      },
    ],
  },
];

const menuOptions = computed(() => {
  switch (pageSidebarMode.value) {
    case "loggedIn":
      return loggedInMenuOptions;
    case "guest":
    default:
      return guestMenuOptions;
  }
});

const activeKey = ref<string>("");
const collapsed = ref<boolean>(true);

const route = useRoute();

function handleUpdateValue(_: unknown, item: MenuOption) {
  computeActiveKey(menuOptions.value, item.path as string);
  if (item.path) navigateTo(item.path as string);
}

function computeActiveKey(menuOptions: MenuOption[], path: string) {
  for (const option of menuOptions) {
    if (option.children instanceof Array) {
      computeActiveKey(option.children, path);
    }
    if (option.path === path) {
      activeKey.value = option.key as string;
    }
  }
}

// 初始化时计算 activeKey
computeActiveKey(menuOptions.value, route.path);

onMounted(() => {
  // 在客户端检查屏幕宽度
  if (window.innerWidth >= 1000) {
    collapsed.value = false;
  }
});
</script>
