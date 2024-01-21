<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <h1>
      {{ poapStore.poap.title }}
    </h1>
    <span v-if="timeToEvent">Time to event: {{ timeToEvent.toString() }}</span>
    <div v-if="poapStore.reservations">
      <n-data-table
        :columns="columns"
        :data="poapStore.reservations.items"
        :pagination="pagination"
        :bordered="false"
      />
    </div>
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
          >Go to page</Btn
        >
      </div>
      <div class="p-2">
        <h2>Website for NFT reservation</h2>
        <p>
          This is the website users will see once they scan the QR code. Users will have to enter
          their email to reserve the NFT, receive minting instructions. Users may mint the NFT at
          any time with the email used to reserve it.
        </p>
        <Btn size="small" type="primary" class="mt-12">Go to page</Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { DataTableColumns } from 'naive-ui/es/data-table';
const { params } = useRoute();
const poapStore = usePoapDropStore();
const timeToEvent = ref();
const router = useRouter();

/**
 * 0 = Not yet started, 1 = In progress, 2 = Finished
 */
const poapStatus = ref(0);

/** Website ID from route */
const poapId = ref<string>(`${params?.id}`);

const columns: DataTableColumns<any> = [
  {
    title: 'Email',
    key: 'email',
    minWidth: 150,
  },
  {
    title: 'Airdrop status',
    key: 'airdropStatus',
    minWidth: 100,
  },
  {
    title: 'Wallet',
    key: 'wallet',
    minWidth: 100,
  },
  {
    title: 'Tx hash',
    key: 'txHash',
    minWidth: 100,
  },
];

const pagination = false;

onMounted(async () => {
  await poapStore.getPoapDrop(poapId.value);
  await poapStore.getPoapDropReservations(poapId.value);
  if (poapStore.poap) {
    const currDate = dayjs(new Date());
    let startTime = dayjs(poapStore.poap.startTime);
    const endTime = dayjs(poapStore.poap.endTime);

    if (currDate >= startTime) {
      if (currDate <= endTime) poapStatus.value = 1;
      else poapStatus.value = 2;
    }

    const daysToStart = startTime.diff(currDate, 'days');
    startTime = startTime.subtract(daysToStart, 'days');

    const hoursToStart = startTime.diff(currDate, 'hours');
    startTime = startTime.subtract(hoursToStart, 'hours');

    const minutesToStart = startTime.diff(currDate, 'minutes');
    startTime = startTime.subtract(minutesToStart, 'minutes');

    const secondsToStart = startTime.diff(currDate, 'seconds');

    timeToEvent.value = `${daysToStart}:${hoursToStart}:${minutesToStart}:${secondsToStart}`;
    // timeToEvent.value = msToTime(
    //   new Date().getTime() - new Date(poapStore.poap.startTime).getTime()
    // );
  }
});
</script>
