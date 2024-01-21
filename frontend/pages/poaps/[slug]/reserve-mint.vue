<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <div v-if="dropReserved == true">
      <p>
        You have successfully reserved nft airdrop. Check your mail for instructions on how to mint.
      </p>
    </div>

    <div v-if="dropReserved != true">
      <div v-if="isTokenValid == false" class="flex flex-col">
        <p>QR code is invalid or has expired. Scan QR code again...</p>
      </div>
      <div v-if="isTokenValid == true" style="width: 500px">
        <h1>Enter your email to reserve NFT</h1>
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="mt-8"
          @submit.prevent="handleSubmit"
        >
          <!--  Project Quota value -->
          <n-form-item
            path="email"
            label="Enter your email to receive instructions"
            :label-props="{ for: 'email' }"
          >
            <n-input v-model:value="formData.email" clearable />
          </n-form-item>

          <!--  Form submit -->
          <n-form-item class="flex justify-center">
            <input type="submit" class="hidden" />
            <Btn type="primary" class="mt-2" :loading="loading" @click="handleSubmit">
              Proceed
            </Btn>
          </n-form-item>
        </n-form>

        <div class="mt-8">
          <h2>Time to reserve</h2>
          <n-progress
            class="mt-8"
            type="line"
            :percentage="tokenValidityInPercent"
            :height="24"
            :border-radius="4"
            :fill-border-radius="0"
            :show-indicator="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { FormInst, FormRules, FormValidationError } from 'naive-ui/es/form';

const loading = ref(false);
const message = useMessage();
const { params, query } = useRoute();
const poapStore = usePoapDropStore();
const isTokenValid = ref(true);
let calcRemainingTimeInterval: any = null as any;
const tokenValidityInPercent = ref(100);
const dropReserved = ref(false);

const token = query.token?.toString();

const formRef = ref<FormInst | null>(null);
const formData = reactive<any>({
  email: null,
  token,
});

const rules: FormRules = {
  email: [
    {
      required: true,
      type: 'string',
      trigger: 'input',
    },
  ],
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      reserveMint();
    }
  });
}

onMounted(() => {
  if (token) {
    const decoded = jwtDecode(token);
    console.info(decoded);

    const tokenIssueDate = dayjs(decoded.iat * 1000);
    // Token should not be older than 7 seconds (7000 ms)
    if (dayjs() - tokenIssueDate > 7000) {
      console.log('Token is too old!');
      isTokenValid.value = false;
    } else {
      console.log('Token is OK!');
      isTokenValid.value = true;
    }

    if (!poapStore.poap) poapStore.getPoapDrop(params?.slug);

    calcRemainingTimeInterval = setInterval(() => {
      const currDate = dayjs();
      const tokenAgeInMs = currDate - tokenIssueDate;

      tokenValidityInPercent.value = 100 - (tokenAgeInMs * 100) / 300000;
      console.info('tokenValidityInPercent', tokenValidityInPercent);

      if (tokenValidityInPercent.value <= 0) {
        tokenValidityInPercent.value = 0;
        isTokenValid.value = false;
        clearInterval(calcRemainingTimeInterval);
      }
    }, 1000);
  } else isTokenValid.value = false;
});

onBeforeUnmount(() => {
  clearInterval(calcRemainingTimeInterval);
});

async function reserveMint() {
  const res: any = await $api.post(`/poap-drops/${params.slug}/reserve-drop`, formData);
  console.info('reserve drop server response', res);
  if (res.data.id) {
    dropReserved.value = true;
    clearInterval(calcRemainingTimeInterval);
  }
}
</script>
