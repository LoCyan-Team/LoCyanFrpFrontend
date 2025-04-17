<template>
  <n-layout-sider
    bordered
    show-trigger
    :collapsed="collapsed"
    @collapse="collapsed = true"
    @expand="collapsed = false"
    collapse-mode="width"
    :collapsed-width="64"
    :native-scrollbar="false"
    id="sider"
    style="height: 100%; bottom: 0"
  >
    <n-menu
      ref="menuInstRef"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      style=""
      :value="activeKey"
      @update:value="handleUpdateValue"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";

import {
  Add,
  BookOutline,
  CloudDownloadOutline,
  FileTrayFull,
  List,
  PaperPlane,
  PencilSharp,
  Person,
  Key,
  CompassSharp,
  GameController
} from '@vicons/ionicons5'
import { GuiManagement, Api, Gift } from '@vicons/carbon'
import { MoreCircle20Filled, Box24Filled } from '@vicons/fluent'
import {
  AttachMoneyFilled,
  AccountTreeOutlined,
  AnchorTwotone,
  MessageOutlined
} from '@vicons/material'

const activeKey = ref<string>("");
const collapsed = ref<boolean>(false);

const menuOptions: MenuOption[] = [
  {
    path: '/dashboard',
    label: '仪表盘',
    key: 'dashboard',
    icon: renderIcon(CompassSharp)
  },
  {
    label: '新年活动',
    key: 'newyear',
    icon: renderIcon(AnchorTwotone),
    show: false,
    children: [
      {
        path: '/newyear/comment',
        label: '留言',
        key: 'comment',
        icon: renderIcon(MessageOutlined)
      },
      {
        path: '/newyear/prize',
        label: '抽奖',
        key: 'prize',
        icon: renderIcon(Gift)
      }
    ]
  },
  {
    path: '/verification',
    label: '身份认证',
    key: 'verification',
    icon: renderIcon(Person)
  },
  {
    path: '/sign',
    label: '签到',
    key: 'sign',
    icon: renderIcon(PencilSharp)
  },
  {
    label: '隧道操作',
    key: 'proxy-actions',
    icon: renderIcon(PaperPlane),
    children: [
      {
        path: '/proxies',
        label: '隧道列表',
        key: 'proxies-list',
        icon: renderIcon(List)
      },
      {
        path: '/proxies/add',
        label: '添加隧道',
        key: 'proxies-add',
        icon: renderIcon(Add)
      },
      {
        path: '/proxies/config',
        label: '配置文件',
        key: 'proxies-config',
        icon: renderIcon(FileTrayFull)
      }
    ]
  },
  {
    path: '/donate',
    label: '赞助',
    key: 'donate',
    icon: renderIcon(AttachMoneyFilled)
  },
  {
    path: '/icp',
    label: '域名白名单',
    key: 'icp',
    icon: renderIcon(Key)
  },
  {
    label: '游戏联机',
    key: 'games',
    icon: renderIcon(GameController),
    children: [
      {
        path: '/games/minecraft',
        label: 'Minecraft',
        key: 'games-minecraft',
        icon: renderIcon(AccountTreeOutlined)
      }
    ]
  },
  {
    label: '应用程序',
    key: 'apps',
    icon: renderIcon(Box24Filled),
    children: [
      {
        path: '/apps/management',
        label: '应用管理',
        key: 'apps-management',
        icon: renderIcon(GuiManagement)
      },
      {
        path: '/apps/access',
        label: '授权管理',
        key: 'apps-access',
        icon: renderIcon(Api)
      }
    ]
  },
  {
    label: '其他功能',
    key: 'other',
    icon: renderIcon(MoreCircle20Filled),
    children: [
      {
        label: () =>
          h(
            'a',
            {
              href: 'https://status.locyanfrp.cn',
              target: '_blank'
            },
            '服务状态'
          ),
        key: 'other-status',
        icon: renderIcon(List)
      },
      {
        path: '/other/software',
        label: '软件下载',
        key: 'other-software',
        icon: renderIcon(CloudDownloadOutline)
      },
      {
        label: () =>
          h(
            'a',
            {
              href: 'https://docs.locyanfrp.cn',
              target: '_blank'
            },
            '帮助文档'
          ),
        key: 'help-document',
        icon: renderIcon(BookOutline)
      }
    ]
  }
];

function handleUpdateValue(_: any, item: MenuOption) {
  navigateTo(item.path as string);
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
</script>
