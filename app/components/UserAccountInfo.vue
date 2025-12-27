<template>
  <n-space vertical>
    <n-card>
      <n-el style="text-align: center">
        <client-only>
          <n-avatar round :size="80" :src="userStore.avatar + '?s=480'" />
        </client-only>
        <br />
        <n-text style="font-size: 20px">
          {{ userStore.username }}
          <n-tag type="info">ID: {{ mainStore.userId }}</n-tag>
        </n-text>
        <br />
        <n-text style="color: gray"
          >本站使用 WeAvatar 公用头像库 API ，可以前往
          <n-a
            v-umami="'click-link-user-info-weavatar'"
            target="_blank"
            href="https://weavatar.com/"
          >
            WeAvatar
          </n-a>
          或
          <n-a
            v-umami="'click-link-user-info-gravatar'"
            target="_blank"
            href="https://gravatar.com/"
          >
            Gravatar
          </n-a>
          修改您的头像
        </n-text>
      </n-el>
      <n-divider />
      <n-el>
        <n-h3>账户信息</n-h3>
        <n-text>邮箱: {{ userStore.email }}</n-text>
        <br />
        <n-text>
          <n-space align="center">
            <n-text>访问密钥:</n-text>
            <n-tooltip trigger="click">
              <template #trigger>
                <n-button
                  v-umami="'click-button-user-info-show-frp-token'"
                  type="success"
                  size="small"
                  secondary
                >
                  点击显示
                </n-button>
              </template>
              <n-scrollbar x-scrollable>
                <n-code :code="userStore.frpToken!" />
              </n-scrollbar>
            </n-tooltip>
            <n-button
              v-umami="'click-button-user-info-copy-frp-token'"
              type="info"
              size="small"
              secondary
              @click="$copyToClipboard(userStore.frpToken!)"
            >
              点击复制
            </n-button>
          </n-space>
        </n-text>
        <n-h3>第三方账户绑定</n-h3>
        <n-el class="three-side-buttons">
          <n-spin :show="loading.thirdParty" style="width: min-content">
            <n-tooltip placement="bottom">
              <template #trigger>
                <n-el v-if="!data.thirdParty.bind.qq">
                  <n-button
                    v-umami="{
                      name: 'click-button-user-info-third-party-bind',
                      第三方平台: 'QQ',
                    }"
                    type="tertiary"
                    circle
                    @click="handleThirdPartyButton(ThirdParty.QQ)"
                  >
                    <client-only>
                      <n-icon><Qq /></n-icon>
                    </client-only>
                  </n-button>
                </n-el>
                <n-el v-else>
                  <n-popconfirm
                    v-umami="{
                      name: 'click-button-user-info-third-party-unbind',
                      第三方平台: 'QQ',
                    }"
                    @positive-click="handleThirdPartyButton(ThirdParty.QQ)"
                  >
                    <template #trigger>
                      <n-button type="info" circle>
                        <client-only>
                          <n-icon><Qq /></n-icon>
                        </client-only>
                      </n-button>
                    </template>
                    正在解除绑定，请确认。
                  </n-popconfirm>
                </n-el>
              </template>
              <n-el v-if="data.thirdParty.bind.qq">已绑定，点击解绑</n-el>
              <n-el v-else>未绑定，点击绑定</n-el>
            </n-tooltip>
          </n-spin>
        </n-el>
        <n-divider />
        <n-space>
          <n-popconfirm @positive-click="handleResetFrpToken">
            <template #trigger>
              <n-button
                v-umami="'click-button-user-info-reset-frp-token'"
                type="error"
                secondary
                :loading="loading.resetFrpToken"
                :disabled="loading.resetFrpToken"
              >
                重置访问密钥
              </n-button>
            </template>
            此操作不可撤销，请确认。
          </n-popconfirm>
          <n-popconfirm @positive-click="handleExitAllDevices">
            <template #trigger>
              <n-button
                v-umami="'click-button-user-info-exit-all-devices'"
                type="error"
                secondary
                :loading="loading.exitAllDevices"
                :disabled="loading.exitAllDevices"
              >
                吊销全部登录设备
              </n-button>
            </template>
            确定要吊销全部登录设备吗？这将从所有设备登出。
          </n-popconfirm>
        </n-space>
      </n-el>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";
import { useUserStore } from "@/store/user";
import Qq from "@vicons/fa/Qq";

import {
  GetThirdParty as GetThirdPartyBind,
  type GetThirdPartyResponse as GetThirdPartyBindResponse,
} from "api/src/api/user/third-party.get";
import {
  GetBind as GetQqBind,
  type GetBindResponse as GetQqBindResponse,
} from "api/src/api/user/third-party/qq/bind.get";
import { DeleteBind as DeleteQqBind } from "api/src/api/user/third-party/qq/bind.delete";
import {
  PostToken as PostResetFrpToken,
  type PostTokenResponse as PostResetFrpTokenResponse,
} from "api/src/api/user/frp/token.post";
import { DeleteAll as DeleteAllToken } from "api/src/api/user/token/all.delete";

const emit = defineEmits<{
  (e: "logout"): void;
}>();

const mainStore = useMainStore();
const userStore = useUserStore();
const client = useApiClient();

const message = useMessage();
const dialog = useDialog();

const loading = ref({
  thirdParty: true,
  resetFrpToken: false,
  exitAllDevices: false,
});

const data = ref({
  thirdParty: {
    bind: {
      qq: false,
    },
  },
});

enum ThirdParty {
  QQ,
}

async function handleThirdPartyButton(type: ThirdParty) {
  switch (type) {
    case ThirdParty.QQ:
      await handleQqButton();
      break;
  }

  async function handleQqButton() {
    if (!data.value.thirdParty.bind.qq) {
      const rs = await client.execute<GetQqBindResponse>(
        new GetQqBind({ user_id: mainStore.userId! }),
      );
      if (rs.status === 200) {
        window.open(rs.data.url);
      } else message.error(rs.message);
    } else {
      const rs = await client.execute(
        new DeleteQqBind({ user_id: mainStore.userId! }),
      );
      if (rs.status === 200) {
        data.value.thirdParty.bind.qq = false;
        dialog.success({
          title: "解除绑定成功",
          content: "已解除与此第三方服务的绑定。",
        });
      } else message.error(rs.message);
    }
  }
}

async function handleResetFrpToken() {
  loading.value.resetFrpToken = true;
  const rs = await client.execute<PostResetFrpTokenResponse>(
    new PostResetFrpToken({ user_id: mainStore.userId! }),
  );
  if (rs.status === 200) {
    userStore.$patch({ frpToken: rs.data.frp_token });
    dialog.success({
      title: "重置成功",
      content: "已重置访问密钥，如您有自定义配置文件，需手动更新。",
    });
  } else message.error(rs.message);
  loading.value.resetFrpToken = false;
}

async function handleExitAllDevices() {
  loading.value.exitAllDevices = true;
  const rs = await client.execute(
    new DeleteAllToken({ user_id: mainStore.userId! }),
  );
  if (rs.status === 200) {
    emit("logout");
  } else message.error(rs.message);
  loading.value.exitAllDevices = false;
}

async function fetchThirdPartyData() {
  const rs = await client.execute<GetThirdPartyBindResponse>(
    new GetThirdPartyBind({ user_id: mainStore.userId! }),
  );
  if (rs.status === 200) {
    data.value.thirdParty.bind = { qq: rs.data.qq };
    loading.value.thirdParty = false;
  } else message.error(rs.message);
}

onMounted(async () => {
  await fetchThirdPartyData();
});
</script>
