<template>
  <page-content title="捐赠">
    <n-space vertical>
      <n-alert type="info" title="捐赠须知">
        一旦付款成功，您的捐赠款项不可退回。
        <br />此处不是问题反馈工具，如您遇到问题请加官方群交流。
      </n-alert>
      <n-card title="捐赠">
        <n-form :model="formData">
          <n-form-item
            v-model:value="formData.amount"
            label="金额"
            path="amount"
          >
            <n-input-number
              v-model:value="formData.amount"
              placeholder="请输入金额"
            />
          </n-form-item>
          <n-form-item label="付款方式" path="paymentMethod">
            <n-radio-group
              v-model:value="formData.paymentMethod"
              name="payment-method"
            >
              <n-radio
                :key="paymentMethods.alipay.value"
                :value="paymentMethods.alipay.value"
              >
                {{ paymentMethods.alipay.name }}
              </n-radio>
            </n-radio-group>
          </n-form-item>
          <n-button
            type="success"
            :loading="loading.submit"
            :disabled="loading.submit"
            @click="handlePayment"
          >
            捐赠
          </n-button>
        </n-form>
      </n-card>

      <n-spin :show="loading.list">
        <n-space vertical>
          <n-card v-if="donations.length === 0">
            <n-empty />
          </n-card>
          <n-scrollbar v-else x-scrollable>
            <n-table
              style="min-width: 800px"
              :bordered="true"
              :single-line="false"
            >
              <n-thead>
                <n-tr>
                  <n-th>捐赠 ID</n-th>
                  <n-th>订单号</n-th>
                  <n-th>金额</n-th>
                  <n-th>付款方式</n-th>
                  <n-th>留言</n-th>
                  <n-th>付款状态</n-th>
                  <n-th>操作</n-th>
                </n-tr>
              </n-thead>
              <n-tbody>
                <n-tr v-for="donation in donations" :key="donation.id">
                  <n-td>{{ donation.id }}</n-td>
                  <n-td>{{ donation.tradeNo }}</n-td>
                  <n-td>{{ donation.amount }}</n-td>
                  <n-td>{{ donation.paymentMethod }}</n-td>
                  <n-td>{{ donation.comment }}</n-td>
                  <n-td>
                    <n-tag v-if="donation.status === 'PAID'" type="success">
                      已支付
                    </n-tag>
                    <n-tag
                      v-else-if="donation.status === 'UNPAID'"
                      type="error"
                    >
                      未支付
                    </n-tag>
                    <n-tag v-else type="warning">未知</n-tag>
                  </n-td>
                  <n-td>
                    <n-spin :show="loading.donationList.includes(donation.id)">
                      <n-space v-if="donation.status === 'PAID'">
                        <n-button
                          type="success"
                          secondary
                          @click="handleButtonComment(donation.id)"
                        >
                          {{ donation.comment !== null ? "修改" : "添加" }}留言
                        </n-button>
                      </n-space>
                      <n-space v-else-if="donation.status === 'UNPAID'">
                        <n-button
                          type="success"
                          @click="handleButtonPayment(donation.id)"
                          >支付</n-button
                        >
                        <n-button
                          type="warning"
                          secondary
                          @click="handleButtonCancel(donation.id)"
                          >取消订单</n-button
                        >
                      </n-space>
                    </n-spin>
                  </n-td>
                </n-tr>
              </n-tbody>
            </n-table>
          </n-scrollbar>
          <n-space
            v-if="donations.length !== 0"
            justify="center"
            style="width: 100%"
          >
            <n-pagination
              v-model:page="page.current"
              v-model:page-size="page.size"
              :page-count="page.count"
              :on-update:page="
                (pageSel) => {
                  page.current = pageSel;
                  getDonations();
                }
              "
              :on-update:page-size="
                (pageSizeSel) => {
                  page.size = pageSizeSel;
                  getDonations();
                }
              "
              show-size-picker
              :page-sizes="[10, 25, 50, 100]"
            />
          </n-space>
        </n-space>
      </n-spin>
    </n-space>
    <n-modal :show="commentModal.show"> </n-modal>
  </page-content>
</template>

<script setup lang="ts">
import { useMainStore } from "@/store/main";

import {
  GetDonations,
  type GetDonationsResponse,
} from "@/api/src/api/donations.get";
import {
  PostDonation,
  type PostDonationResponse,
} from "@/api/src/api/donation.post";

definePageMeta({
  title: "捐赠",
});

const mainStore = useMainStore();
const client = useApiClient();

const message = useMessage();

const loading = ref<{
  list: boolean;
  submit: boolean;
  donationList: number[];
}>({
  list: true,
  submit: false,
  donationList: [],
});

const commentModal = ref<{
  show: boolean;
  form: {
    id: number;
    message: string | number;
  };
}>({
  show: false,
  form: {
    id: 0,
    message: null,
  },
});

const formData = ref<{
  amount: number;
  paymentMethod: string;
}>({
  amount: 1,
  paymentMethod: "alipay",
});

const donations = ref<
  {
    id: number;
    tradeNo: string;
    amount: number;
    paymentMethod: string;
    comment: string | null;
    status: "PAID" | "UNPAID";
  }[]
>([]);

const paymentMethods = {
  alipay: {
    name: "支付宝",
    value: "alipay",
  },
};

const page = ref<{
  current: number;
  size: number;
  count: number;
}>({
  current: 1,
  size: 10,
  count: 1,
});

async function handlePayment() {
  loading.value.submit = true;
  const rs = await client.execute<PostDonationResponse>(
    new PostDonation({
      user_id: mainStore.userId!,
      amount: formData.value.amount,
    }),
  );
  if (rs.status === 200) {
    window.open(rs.data.url);
  } else message.error(rs.message);
  loading.value.submit = false;
}

async function handleButtonComment(donationId: number) {
  commentModal.value.form.id = donationId;
  commentModal.value.show = true;
}

async function handleComment(donationId: number) {
  loading.value.donationList[donationId] = true;
  const rs = await client.execute<PutDonationCommentResponse>(
    new PutDonationComment({
      user_id: number,
      donation_id: number,
    }),
  );
  if (rs.status === 200) {
    message.success("留言成功—");
  } else message.error(rs.message);
  loading.value.donationList[donationId] = false;
}

async function handleButtonPayment(donationId: number) {
  loading.value.donationList.push(donationId);
  const rs = await client.execute<PostDonationPaymentResponse>(
    new PostDonationPayment({
      user_id: number,
      donation_id: number,
    }),
  );
  if (rs.status === 200) {
    window.open(rs.data.url);
  } else message.error(rs.message);
  loading.value.donationList = loading.value.donationList.filter(
    (val) => val !== donationId,
  );
}

async function handleButtonCancel(donationId: number) {
  loading.value.donationList.push(donationId);
  const rs = await client.execute<DeleteDonationPaymentResponse>(
    new DeleteDonationPayment({
      user_id: number,
      donation_id: number,
    }),
  );
  if (rs.status === 200) {
    window.open(rs.data.url);
  } else message.error(rs.message);
  loading.value.donationList = loading.value.donationList.filter(
    (val) => val !== donationId,
  );
}

async function getDonations() {
  loading.value.list = true;
  const rs = await client.execute<GetDonationsResponse>(
    new GetDonations({
      user_id: mainStore.userId!,
      page: page.value.current,
      size: page.value.size,
    }),
  );
  if (rs.status === 200) {
    page.value.count = rs.data.pagination.count;
    donations.value.length = 0;
    rs.data.list.forEach((it) => {
      donations.value.push({
        id: it.id,
        tradeNo: it.trade_no,
        amount: it.amount,
        paymentMethod: it.pay_type,
        comment: it.message,
        status: it.status,
      });
    });
  } else message.error(rs.message);
  loading.value.list = false;
}

onMounted(async () => {
  await getDonations();
});
</script>
