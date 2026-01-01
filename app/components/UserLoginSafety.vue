<template>
  <n-space vertical>
    <n-card title="修改信息">
      <n-tabs type="line" default-value="username" animated>
        <n-tab-pane name="username" tab="修改用户名">
          <n-space vertical>
            <n-alert type="info" title="注意">
              修改后，账户登录信息也会随之改变。
            </n-alert>
            <n-form
              ref="updateUsernameFormRef"
              :model="updateUsernameForm"
              :rules="updateUserRules"
            >
              <n-form-item label="新用户名" path="username">
                <n-input
                  v-model:value="updateUsernameForm.username"
                  placeholder="请输入新用户名"
                />
              </n-form-item>
              <n-button
                v-umami="'click-button-user-info-update-username-submit'"
                :loading="loading.updateUsername"
                :disabled="loading.updateUsername"
                type="success"
                @click="handleUpdateUsername"
              >
                提交
              </n-button>
            </n-form>
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="password" tab="修改密码">
          <n-space vertical>
            <n-alert type="info" title="注意">
              修改后，账户登录信息也会随之改变。
            </n-alert>
            <n-form
              ref="updatePasswordFormRef"
              :model="updatePasswordForm"
              :rules="updatePasswordRules"
            >
              <n-form-item label="原密码" path="oldPassword">
                <n-input
                  v-model:value="updatePasswordForm.oldPassword"
                  type="password"
                  placeholder="请输入旧密码"
                />
              </n-form-item>
              <n-form-item label="新密码" path="newPassword">
                <n-input
                  v-model:value="updatePasswordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                />
              </n-form-item>
              <n-form-item label="确认密码" path="confirmPassword">
                <n-input
                  v-model:value="updatePasswordForm.confirmPassword"
                  type="password"
                  placeholder="请重复新密码"
                />
              </n-form-item>
              <n-button
                v-umami="'click-button-user-info-update-password-submit'"
                :loading="loading.updatePassword"
                :disabled="loading.updatePassword"
                type="success"
                @click="handleUpdatePassword"
              >
                提交
              </n-button>
            </n-form>
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="email" tab="修改邮箱">
          <n-space vertical>
            <n-alert type="info" title="注意">
              修改后，账户登录信息也会随之改变。
            </n-alert>
            <n-form
              ref="updateEmailFormRef"
              :model="updateEmailForm"
              :rules="updateEmailRules"
            >
              <n-form-item label="新邮箱" path="email">
                <n-input
                  v-model:value="updateEmailForm.email"
                  placeholder="请输入新邮箱"
                />
              </n-form-item>
              <n-form-item label="邮件验证码" path="verifyCode">
                <n-input-number
                  v-model:value="updateEmailForm.verifyCode"
                  placeholder="请输入验证码"
                />
                <n-button
                  v-umami="
                    'click-button-user-info-update-email-email-code-send'
                  "
                  style="margin-left: 0.5rem"
                  :loading="loading.updateEmail.emailCode"
                  :disabled="loading.updateEmail.emailCode"
                  type="success"
                  secondary
                  @click="handleGetUpdateEmailCodeSend"
                >
                  发送验证码
                </n-button>
              </n-form-item>
              <n-button
                v-umami="'click-button-user-info-update-email-submit'"
                :loading="loading.updateEmail.submit"
                :disabled="loading.updateEmail.submit"
                type="success"
                @click="handleUpdateEmail"
              >
                提交
              </n-button>
            </n-form>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <n-card title="通行密钥">
      <n-space vertical>
        <n-button type="success" disabled @click="handleRegisterPasskey">
          注册通行密钥
        </n-button>
        <n-scrollbar x-scrollable>
          <n-table
            style="min-width: 500px"
            :bordered="true"
            :single-line="false"
          >
            <n-thead>
              <n-tr>
                <n-th>密钥名称</n-th>
                <n-th>创建时间</n-th>
                <n-th>上次使用时间</n-th>
                <n-th>操作</n-th>
              </n-tr>
            </n-thead>
            <n-tbody>
              <n-tr v-for="passkey in registeredPasskeys" :key="passkey.id">
                <n-td>{{ passkey.name }}</n-td>
                <n-td>{{ passkey.createTime }}</n-td>
                <n-td>{{ passkey.lastUsed }}</n-td>
                <n-td>
                  <n-button type="error" secondary>取消绑定</n-button>
                </n-td>
              </n-tr>
            </n-tbody>
          </n-table>
        </n-scrollbar>
      </n-space>
    </n-card>

    <n-card title="双因素身份验证">
      <n-space vertical>
        <n-space>
          <n-button
            type="success"
            :disabled="totpRegistered || loading.totp.register"
            :loading="loading.totp.register"
            @click="handleStartTotpRegisterButton"
          >
            注册 TOTP 验证器
          </n-button>
          <n-popconfirm @positive-click="handleTotpUnregisterButton">
            <template #trigger>
              <n-button
                type="error"
                secondary
                :disabled="!totpRegistered || loading.totp.unregister"
                :loading="loading.totp.unregister"
              >
                解除绑定 TOTP 验证器
              </n-button>
            </template>
            确认要解除绑定吗？绑定的验证器将失效。
          </n-popconfirm>
        </n-space>
      </n-space>

      <n-modal
        v-model:show="totpModal.show"
        preset="card"
        title="请使用验证器扫描二维码"
        :bordered="false"
        :mask-closable="false"
        style="max-width: 600px"
        content-style="text-align: center;"
      >
        <n-space vertical style="align-items: center">
          <n-qr-code
            :value="totpModal.qrCodeUrl!"
            :size="200"
            :error-correction-level="'L'"
          />
          <n-thing>
            <n-scrollbar x-scrollable>
              <n-button text @click="clipboard.copy(totpModal.secret!)">
                <n-code :code="totpModal.secret!" />
              </n-button>
            </n-scrollbar>
          </n-thing>
          <n-space style="align-items: center">
            <n-form ref="totpFormRef" :model="totpForm" :rules="totpRules">
              <n-form-item label="TOTP 验证代码" path="code">
                <n-input-otp
                  v-model:value="totpForm.code"
                  :allow-input="
                    (value: string) => !value || /^\d+$/.test(value)
                  "
                  @finish="handleTotpRegisterButton"
                />
              </n-form-item>
            </n-form>
          </n-space>
        </n-space>
      </n-modal>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule } from "naive-ui";
import { useMainStore } from "@/store/main";
import { PutUsername } from "@locyanfrp-dashboard-frontend/api/src/user/username.put";
import { PutPassword } from "@locyanfrp-dashboard-frontend/api/src/user/password.put";
import { GetEmail as GetUpdateEmailCode } from "@locyanfrp-dashboard-frontend/api/src/email/email.get";
import { PutEmail } from "@locyanfrp-dashboard-frontend/api/src/user/email.put";
import FormValidator from "@/utils/formValidator";
import {
  GetOptions as GetPasskeyOptions,
  type GetOptionsResponse as GetPasskeyOptionsResponse,
} from "@locyanfrp-dashboard-frontend/api/src/user/webauthn/passkey/options.get";
import { PutPasskey } from "@locyanfrp-dashboard-frontend/api/src/user/webauthn/passkey.put";
import {
  GetPasskeys,
  type GetPasskeysResponse,
} from "@locyanfrp-dashboard-frontend/api/src/user/webauthn/passkeys.get";
import {
  GetTotp,
  type GetTotpResponse,
} from "@locyanfrp-dashboard-frontend/api/src/user/totp.get";
import {
  PostTotp,
  type PostTotpResponse,
} from "@locyanfrp-dashboard-frontend/api/src/user/totp.post";
import { PutTotp } from "@locyanfrp-dashboard-frontend/api/src/user/totp.put";
import { DeleteTotp } from "@locyanfrp-dashboard-frontend/api/src/user/totp.delete";

const clipboard = useClipboard();

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();
const dialog = useDialog();
const notification = useNotification();

const loading = ref({
  updateUsername: false,
  updatePassword: false,
  updateEmail: {
    emailCode: false,
    submit: false,
  },
  passkey: {
    register: false,
  },
  totp: {
    register: false,
    unregister: false,
  },
});

const updateUsernameForm = ref<{
    username: string | null;
  }>({
    username: null,
  }),
  updatePasswordForm = ref<{
    oldPassword: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
  }>({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  }),
  updateEmailForm = ref<{
    email: string | null;
    verifyCode: number | null;
  }>({
    email: null,
    verifyCode: null,
  });

const totpForm = ref<{
  code: string[] | null;
}>({
  code: null,
});

const updateUsernameFormRef = ref<FormInst | null>(null),
  updatePasswordFormRef = ref<FormInst | null>(null),
  updateEmailFormRef = ref<FormInst | null>(null),
  totpFormRef = ref<FormInst | null>(null);

const updateUserRules = {
    username: [
      {
        required: true,
        message: "请输入用户名",
        trigger: ["input", "blur"],
      },
      {
        pattern: FormValidator.regex.username,
        message:
          "用户名长度1-24位，只能包含字母、数字、下划线、中文、日文、韩文和连字符",
        trigger: ["input", "blur"],
      },
    ] as FormItemRule[],
  },
  updatePasswordRules = {
    oldPassword: [
      { required: true, message: "请输入原密码", trigger: ["input", "blur"] },
    ] as FormItemRule[],
    newPassword: [
      { required: true, message: "请输入新密码", trigger: ["input", "blur"] },
    ] as FormItemRule[],
    confirmPassword: [
      { required: true, message: "请确认新密码", trigger: ["input", "blur"] },
      {
        validator: (_: unknown, value: string) => {
          if (value !== updatePasswordForm.value.newPassword) {
            return new Error("两次输入的密码不一致");
          }
          return true;
        },
        trigger: ["input", "blur"],
      },
    ] as FormItemRule[],
  },
  updateEmailRules = {
    email: [
      { required: true, message: "请输入邮箱地址", trigger: ["input", "blur"] },
      {
        pattern: FormValidator.regex.email,
        message: "请输入有效的邮箱地址",
        trigger: ["input", "blur"],
      },
    ] as FormItemRule[],
    verifyCode: [
      {
        required: true,
        validator: (_: unknown, value: number) =>
          FormValidator.number(value, "请输入验证码"),
        trigger: ["input", "blur"],
      },
    ] as FormItemRule[],
  },
  totpRules = {
    code: [
      {
        required: true,
        validator: (_: unknown, value: number) =>
          FormValidator.number(value, "请输入验证代码"),
        trigger: ["input", "blur"],
      },
    ] as FormItemRule[],
  };

const totpModal = ref<{
  show: boolean;
  secret: string | null;
  qrCodeUrl: string | null;
}>({
  show: false,
  secret: null,
  qrCodeUrl: null,
});

const registeredPasskeys = ref<
  {
    id: number;
    name: string;
    createTime: string;
    lastUsed: string;
  }[]
>([]);

const totpRegistered = ref(false);

/**
 * 更新用户名
 */
async function handleUpdateUsername() {
  if (!updateUsernameFormRef.value) return;
  updateUsernameFormRef.value.validate().then(async () => {
    loading.value.updateUsername = true;
    const rs = await client.execute(
      new PutUsername({
        user_id: mainStore.userId!,
        new_username: updateUsernameForm.value.username!,
      }),
    );
    if (rs.status === 200) {
      dialog.success({ title: "更新成功", content: "已更新用户名。" });
    } else message.error(rs.message);
    loading.value.updateUsername = false;
  });
}

/**
 * 更新密码
 */
async function handleUpdatePassword() {
  if (!updatePasswordFormRef.value) return;
  updatePasswordFormRef.value.validate().then(async () => {
    loading.value.updatePassword = true;
    const rs = await client.execute(
      new PutPassword({
        user_id: mainStore.userId!,
        old_password: updatePasswordForm.value.oldPassword!,
        new_password: updatePasswordForm.value.newPassword!,
      }),
    );
    if (rs.status === 200) {
      dialog.success({ title: "更新成功", content: "已更新账户密码。" });
    } else message.error(rs.message);
    loading.value.updatePassword = false;
  });
}

/**
 * 获取更新邮箱验证码
 */
async function handleGetUpdateEmailCodeSend() {
  loading.value.updateEmail.emailCode = true;
  const rs = await client.execute(
    new GetUpdateEmailCode({
      user_id: mainStore.userId!,
      email: updateEmailForm.value.email!,
    }),
  );
  if (rs.status === 200) {
    notification.success({
      title: "已发送",
      content: "若未收到请检查垃圾箱。",
      duration: 2500,
    });
  } else message.error(rs.message);
  loading.value.updateEmail.emailCode = false;
}

/**
 * 更新邮箱
 */
async function handleUpdateEmail() {
  if (!updateEmailFormRef.value) return;
  updateEmailFormRef.value.validate().then(async () => {
    loading.value.updateEmail.submit = true;
    const rs = await client.execute(
      new PutEmail({
        user_id: mainStore.userId!,
        verify_code: updateEmailForm.value.verifyCode!,
      }),
    );
    if (rs.status === 200) {
      dialog.success({ title: "更新成功", content: "已更新账户邮箱。" });
    } else message.error(rs.message);
    loading.value.updateEmail.submit = false;
  });
}

/**
 * 获取已注册的通行密钥
 */
async function fetchRegisteredPasskeys() {
  const rs = await client.execute<GetPasskeysResponse>(
    new GetPasskeys({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    rs.data.list
      .slice()
      .sort((a, b) => a.id - b.id)
      .forEach((it) => {
        registeredPasskeys.value.push({
          id: it.id,
          name: it.name,
          createTime: it.create_time,
          lastUsed: it.last_used,
        });
      });
  } else {
    message.error(rs.message);
  }
}

/**
 * 注册通行密钥
 */
async function handleRegisterPasskey() {
  if (
    !navigator.credentials ||
    !PublicKeyCredential ||
    !PublicKeyCredential.parseCreationOptionsFromJSON
  ) {
    message.error("您的浏览器不支持 WebAuthn API，请更换浏览器重试。");
  }

  const rs = await client.execute<GetPasskeyOptionsResponse>(
    new GetPasskeyOptions({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    let publicKeyConverted;
    try {
      publicKeyConverted = PublicKeyCredential.parseCreationOptionsFromJSON(
        // @ts-expect-error do not mark publicKey attr as error
        rs.data.options.publicKey,
      );
    } catch (e) {
      message.error((e as DOMException).message);
    }
    navigator.credentials
      .create({
        ...rs.data.options,
        publicKey: publicKeyConverted,
      })
      .then(async (response) => {
        const rs = await client.execute(
          new PutPasskey({
            user_id: mainStore.userId!,
            response_json: JSON.stringify(response),
          }),
        );
        if (rs.status === 200) {
          dialog.success({ title: "注册成功", content: "已注册通行密钥。" });
        } else {
          message.error(rs.message);
        }
      })
      .catch((e) => {
        message.error(e.message);
      });
  } else {
    message.error(rs.message);
  }
}

async function fetchTotpStatus() {
  const rs = await client.execute<GetTotpResponse>(
    new GetTotp({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    totpRegistered.value = rs.data.registered;
  } else {
    message.error(rs.message);
  }
}

async function handleStartTotpRegisterButton() {
  loading.value.totp.register = true;
  const rs = await client.execute<PostTotpResponse>(
    new PostTotp({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    totpModal.value.secret = rs.data.secret;
    totpModal.value.qrCodeUrl = rs.data.url;
    totpModal.value.show = true;
  } else {
    message.error(rs.message);
  }
  loading.value.totp.register = false;
}

async function handleTotpRegisterButton() {
  if (!totpFormRef.value) return;
  totpFormRef.value.validate().then(async () => {
    loading.value.totp.register = true;
    const rs = await client.execute(
      new PutTotp({
        user_id: mainStore.userId!,
        code: Number(totpForm.value.code!.join("")),
      }),
    );
    if (rs.status === 200) {
      totpRegistered.value = true;
      totpModal.value.show = false;
      dialog.success({ title: "注册成功", content: "成功注册 TOTP 验证器。" });
    } else {
      message.error(rs.message);
    }
    loading.value.totp.register = false;
  });
}

async function handleTotpUnregisterButton() {
  const rs = await client.execute(
    new DeleteTotp({
      user_id: mainStore.userId!,
    }),
  );
  if (rs.status === 200) {
    totpRegistered.value = false;
    dialog.success({
      title: "解除绑定成功",
      content: "成功解除绑定 TOTP 验证器。",
    });
  } else {
    message.error(rs.message);
  }
}

onMounted(() => {
  // fetchRegisteredPasskeys();
  fetchTotpStatus();
});
</script>
