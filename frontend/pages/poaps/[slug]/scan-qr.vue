<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <h1>Scan the code and receive NFT</h1>
    <n-qr-code v-if="qrCodeText" :value="qrCodeText" class="mt-16" :size="200" />

    <Btn
      size="small"
      type="primary"
      class="mt-12"
      @click="router.push(`/poaps/${params?.slug}/reserve-mint?token=${qrCodeText}`)"
      >Reserve mint</Btn
    >
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const poapStore = usePoapDropStore();
let qrCodeInterval: any = null as any;
const qrCodeText = ref('');

/** Website ID from route */
const poapId = ref<string>(`${params?.slug}`);

onMounted(async () => {
  await poapStore.getPoapDrop(poapId.value);

  const response = await $api.get(`/poap-drops/${poapId.value}/drop-reservation-token`);
  qrCodeText.value = (response as any).data.token;

  qrCodeInterval = setInterval(async () => {
    const response = await $api.get(`/poap-drops/${poapId.value}/drop-reservation-token`);
    qrCodeText.value = (response as any).data.token;
  }, 5000);
});
</script>
