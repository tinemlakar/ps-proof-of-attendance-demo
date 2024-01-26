<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <h1>
      {{ poapStore.poap.title }}
    </h1>
    <div v-if="poapStatus == 0" class="flex flex-col items-center mt-4">
      <span>Time to event</span>
      <Timer :date-time-to="poapStore.poap?.startTime"></Timer>
    </div>
    <div v-else-if="poapStatus == 1" class="flex flex-col items-center">
      <span>Event running</span>
      <p>Time to event ends</p>
      <Timer :date-time-to="poapStore.poap?.endTime"></Timer>
    </div>
    <span v-else-if="poapStatus == 2">Event concluded</span>

    <div v-if="poapStatus == 0 || poapStatus == 1" class="flex flex-col items-center">
      <div v-if="poapStore.reservations" class="mt-8">
        <h2>Recent activity</h2>
        <n-data-table
          :columns="columns"
          :data="poapStore.reservations.items"
          :pagination="pagination"
          :bordered="false"
        />
      </div>
      <div class="grid grid-cols-2 mt-16" style="max-width: 850px">
        <div class="p-2 flex flex-col">
          <h2>Website for QR scanning</h2>
          <p class="mb-8">
            Display this website somewhere on your event grounds. The website will automatically
            generate new QR codes every 20 seconds, allowing users to scan them and reserve the
            NFTs.
          </p>
          <n-checkbox v-model:checked="immediatelyShowQr"> Immediately show QR code</n-checkbox>
          <Btn
            size="small"
            type="primary"
            @click="
              router.push(`/poaps/${params?.id}/scan-qr?immediatelyShowQr=${immediatelyShowQr}`)
            "
            >Go to page</Btn
          >
        </div>
        <div class="p-2 flex flex-col">
          <h2>Website for NFT reservation</h2>
          <p>
            This is the website users will see once they scan the QR code. Users will have to enter
            their email to reserve the NFT, receive minting instructions. Users may mint the NFT at
            any time with the email used to reserve it.
          </p>
          <Btn size="small" type="primary" class="mt-8" @click="navigateToReserveDrop()"
            >Go to page</Btn
          >
        </div>
      </div>
    </div>
    <div v-if="poapStatus == 2" class="w-full p-16">
      <h1>Event statistics</h1>
      <div class="flex">
        <div
          class="flex flex-col items-center p-2 rounded-md mr-4"
          style="background-color: #1e212b; width: 150px"
        >
          <span class="font-bold" style="font-size: xx-large">{{
            poapStore.reservations.total
          }}</span>
          <p style="font-size: x-small">Total participants</p>
        </div>
        <div
          class="flex flex-col items-center p-2 rounded-md"
          style="background-color: #1e212b; width: 150px"
        >
          <span class="font-bold" style="font-size: xx-large"
            >{{ poapStore.reservations.items.filter(x => x.airdropStatus == 6).length }} /
            {{ poapStore.reservations.total }}</span
          >
          <p style="font-size: x-small">Minted NFTs</p>
        </div>
      </div>
      <!--Event concluded -->
      <n-data-table
        :columns="columns"
        :data="poapStore.reservations.items"
        :pagination="pagination"
        :bordered="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { DataTableColumns } from 'naive-ui/es/data-table';
import { PAGINATION_LIMIT } from '~/lib/values/general.values';
const { params } = useRoute();
const poapStore = usePoapDropStore();
const router = useRouter();
const airdropStatuses = {
  1: 'Pending',
  2: 'Email sent',
  3: 'Email error',
  4: 'Wallet linked',
  5: 'Transaction created',
  6: 'Airdrop completed',
  7: 'Airdrop error',
};
/**
 * 0 = Not yet started, 1 = In progress, 2 = Finished
 */
const poapStatus = ref();
const immediatelyShowQr = ref(false);

let refreshEventTimeInterval: any = null as any;

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
    render(row: any) {
      return h('span', {}, { default: () => airdropStatuses[row.airdropStatus] });
    },
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

const pagination = computed(() => {
  return {
    pageSize: PAGINATION_LIMIT,
  };
});

onMounted(async () => {
  await poapStore.getPoapDrop(poapId.value);
  await poapStore.getPoapDropReservations(poapId.value);
  if (poapStore.poap) {
    refreshEventTimeInterval = setInterval(() => {
      calculatePoapStatus();
    }, 1000);
  }
});

onBeforeUnmount(() => {
  clearInterval(refreshEventTimeInterval);
});

function calculatePoapStatus() {
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
      clearInterval(refreshEventTimeInterval);
    }
  } else {
    poapStatus.value = 0;
  }
}

async function navigateToReserveDrop() {
  const response = await $api.get(`/poap-drops/${poapId.value}/drop-reservation-token`);
  router.push(`/poaps/${poapId.value}/reserve-mint?token=${(response as any).data.token}`);
}
</script>
