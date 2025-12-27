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
        <n-button type="success" @click="handleRegisterPasskey">
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
    <!-- Keep -->
    <!--    <n-card title="双因素身份验证">-->
    <!--      <n-space vertical>-->
    <!--        <n-space>-->
    <!--          <n-button type="success">注册 OTP 管理器</n-button>-->
    <!--          <n-button type="error" secondary>取消绑定</n-button>-->
    <!--        </n-space>-->
    <!--        <n-table :bordered="true" :single-line="false">-->
    <!--          <n-thead>-->
    <!--            <n-tr>-->
    <!--              <n-th>设备名称</n-th>-->
    <!--              <n-th>创建时间</n-th>-->
    <!--            </n-tr>-->
    <!--          </n-thead>-->
    <!--          <n-tbody>-->
    <!--            <n-tr>-->
    <!--              <n-td></n-td>-->
    <!--              <n-td></n-td>-->
    <!--            </n-tr>-->
    <!--          </n-tbody>-->
    <!--        </n-table>-->
    <!--      </n-space>-->
    <!--    </n-card>-->
  </n-space>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule } from "naive-ui";
import { useMainStore } from "@/store/main";
import { PutUsername } from "api/src/api/user/username.put";
import { PutPassword } from "api/src/api/user/password.put";
import { GetEmail as GetUpdateEmailCode } from "api/src/api/email/email.get";
import { PutEmail } from "api/src/api/user/email.put";
import FormValidator from "@/utils/formValidator";
import {
  GetOptions as GetPasskeyOptions,
  type GetOptionsResponse as GetPasskeyOptionsResponse,
} from "api/src/api/user/webauthn/passkey/options.get";
import { PutPasskey } from "api/src/api/user/webauthn/passkey.put";
import {
  GetPasskeys,
  type GetPasskeysResponse,
} from "api/src/api/user/webauthn/passkeys.get";

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
});

const updateUsernameForm = ref({
    username: null as string | null,
  }),
  updatePasswordForm = ref({
    oldPassword: null as string | null,
    newPassword: null as string | null,
    confirmPassword: null as string | null,
  }),
  updateEmailForm = ref({
    email: null as string | null,
    verifyCode: null as number | null,
  });

const updateUsernameFormRef = ref<FormInst | null>(null),
  updatePasswordFormRef = ref<FormInst | null>(null),
  updateEmailFormRef = ref<FormInst | null>(null);

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
  };

const registeredPasskeys = ref<
  {
    id: number;
    name: string;
    createTime: string;
    lastUsed: string;
  }[]
>([]);

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

onMounted(() => {
  fetchRegisteredPasskeys();
});
</script>
