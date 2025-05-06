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
          <n-button type="success" @click="handlePayment">捐赠</n-button>
        </n-form>
      </n-card>

      <n-empty v-if="donations.length === 0" />
      <n-scrollbar v-else x-scrollable>
        <n-table style="min-width: 800px" :bordered="true" :single-line="false">
          <n-thead>
            <n-tr>
              <n-th>捐赠 ID</n-th>
              <n-th>订单号</n-th>
              <n-th>金额</n-th>
              <n-th>付款方式</n-th>
              <n-th>留言</n-th>
            </n-tr>
          </n-thead>
          <n-tbody>
            <n-tr v-for="donation in donations" :key="donation.id">
              <n-td>{{ donation.id }}</n-td>
              <n-td>{{ donation.tradeId }}</n-td>
              <n-td>{{ donation.amount }}</n-td>
              <n-td>{{ donation.paymentMethod }}</n-td>
              <n-td>{{ donation.comment }}</n-td>
            </n-tr>
          </n-tbody>
        </n-table>
      </n-scrollbar>
    </n-space>
  </page-content>
</template>

<script setup lang="ts">
definePageMeta({
  title: "捐赠",
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
    tradeId: string;
    amount: number;
    paymentMethod: string;
    comment?: string;
  }[]
>([]);

const paymentMethods = {
  alipay: {
    name: "支付宝",
    value: "alipay",
  },
};

function handlePayment() {
  // TODO
}
</script>
