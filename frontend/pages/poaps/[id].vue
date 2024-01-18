<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <h1>
      {{ poapStore.poap.title }}
    </h1>
    <span v-if="timeToEvent">Time to event: {{ timeToEvent.toString() }}</span>
    <div class="grid grid-cols-2 mt-16" style="max-width: 700px">
      <div class="p-2">
        <h2>Website for QR scanning</h2>
        <p>
          Display this website somewhere on your event grounds. The website will automatically
          generate new QR codes every 20 seconds, allowing users to scan them and reserve the NFTs.
        </p>
        <Btn
          size="small"
          type="primary"
          class="mt-12"
          @click="router.push(`/poaps/${params?.id}/scan-qr`)"
          >Create</Btn
        >
      </div>
      <div class="p-2">
        <h2>Website for NFT reservation</h2>
        <p>
          This is the website users will see once they scan the QR code. Users will have to enter
          their email to reserve the NFT, receive minting instructions. Users may mint the NFT at
          any time with the email used to reserve it.
        </p>
        <Btn size="small" type="primary" class="mt-12">Create</Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
const { params } = useRoute();
const refreshInterval = ref<any>(null);
const poapStore = usePoapDropStore();
const timeToEvent = ref();
const router = useRouter();

/** Website ID from route */
const poapId = ref<string>(`${params?.id}`);

onMounted(async () => {
  await poapStore.getPoapDrop(poapId.value);
  if (poapStore.poap) {
    const currDate = dayjs(new Date());
    let startDate = dayjs(poapStore.poap.startTime);

    const daysToStart = startDate.diff(currDate, 'days');
    startDate = startDate.subtract(daysToStart, 'days');

    const hoursToStart = startDate.diff(currDate, 'hours');
    startDate = startDate.subtract(hoursToStart, 'hours');

    const minutesToStart = startDate.diff(currDate, 'minutes');
    startDate = startDate.subtract(minutesToStart, 'minutes');

    const secondsToStart = startDate.diff(currDate, 'seconds');

    timeToEvent.value = `${daysToStart}:${hoursToStart}:${minutesToStart}:${secondsToStart}`;
    // timeToEvent.value = msToTime(
    //   new Date().getTime() - new Date(poapStore.poap.startTime).getTime()
    // );
  }
});
</script>
