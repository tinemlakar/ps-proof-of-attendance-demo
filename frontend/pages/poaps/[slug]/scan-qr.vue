<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <h1>Scan the code and receive NFT</h1>
    <n-qr-code v-if="qrCodeText" :value="qrCodeText" class="mt-16" :size="200" />

    <!--<Btn
      size="small"
      type="primary"
      class="mt-12"
      @click="router.push(`/poaps/${params?.slug}/reserve-mint?token=${token}`)"
      >Reserve mint</Btn
    >-->
  </div>
</template>

<script lang="ts" setup>
const CONFIG = getConfig();
const router = useRouter();
const { params } = useRoute();
const poapStore = usePoapDropStore();
const qrCodeText = ref('');
const token = ref('');
let qrCodeInterval: any = null as any;

/** Website ID from route */
const poapId = ref<string>(`${params?.slug}`);

onMounted(async () => {
  await poapStore.getPoapDrop(poapId.value);
  await setQrCodeValue();

  qrCodeInterval = setInterval(async () => {
    await setQrCodeValue();
  }, 5000);
});

onBeforeUnmount(() => {
  console.info('onBefore unmount');
  clearInterval(qrCodeInterval);
});

async function setQrCodeValue() {
  const response = await $api.get(`/poap-drops/${poapId.value}/drop-reservation-token`);
  qrCodeText.value = `${CONFIG.APP_URL}/poaps/${poapId.value}/reserve-mint?token=${
    (response as any).data.token
  }`;
  token.value = (response as any).data.token;
}
</script>
