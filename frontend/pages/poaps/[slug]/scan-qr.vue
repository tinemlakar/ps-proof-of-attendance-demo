<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <div v-if="poapStatus == 0" class="flex flex-col items-center mt-4">
      <span>Time to event</span>
      <Timer :date-time-to="poapStore.poap?.startTime"></Timer>
    </div>
    <div v-if="poapStatus == 1 || immediatelyShowQr == true" class="flex flex-col items-center">
      <h1>Scan the code and receive NFT</h1>
      <n-qr-code v-if="qrCodeText" :value="qrCodeText" class="mt-16" :size="200" />
    </div>
    <span v-else-if="poapStatus == 2">Event concluded</span>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';

const CONFIG = getConfig();
const { params, query } = useRoute();
const poapStore = usePoapDropStore();
const qrCodeText = ref('');
const token = ref('');
let qrCodeInterval: any = null as any;
/**
 * 0 = Not yet started, 1 = In progress, 2 = Finished
 */
const poapStatus = ref();

/** Website ID from route */
const poapId = ref<string>(`${params?.slug}`);
const immediatelyShowQr = ref(query.immediatelyShowQr === 'true');

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
  // First check POAP status
  const currDate = dayjs(new Date());
  const startTime = dayjs(poapStore.poap?.startTime);
  const endTime = dayjs(poapStore.poap?.endTime);

  if (currDate >= startTime) {
    if (currDate <= endTime) {
      // Event is running
      poapStatus.value = 1;
    } else {
      // Event has ended
      poapStatus.value = 2;
      if (immediatelyShowQr.value !== true) clearInterval(qrCodeInterval);
    }
  } else {
    poapStatus.value = 0;
  }

  if (poapStatus.value === 1 || immediatelyShowQr.value === true) {
    const response = await $api.get(`/poap-drops/${poapId.value}/drop-reservation-token`);
    qrCodeText.value = `${CONFIG.APP_URL}/poaps/${poapId.value}/reserve-mint?token=${
      (response as any).data.token
    }`;
    token.value = (response as any).data.token;
  }
}
</script>
