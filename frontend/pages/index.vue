<template>
  <div class="grid justify-items-center">
    <div class="text-lg"><span>Proof of attendance</span></div>
    <div v-if="!isConnected">
      <Btn @click="connect({ connector: connectors[0] })">Connect wallet</Btn>
    </div>
    <div v-if="isConnected && !jwt">
      <Btn v-if="!poapStore.poaps" type="primary" @click="login()">Login</Btn>
    </div>
    <div v-if="poapStore.poaps" class="flex flex-col">
      <div v-if="poapStore.poaps.length != 0">
        <n-data-table
          :columns="columns"
          :data="poapStore.poaps"
          :pagination="pagination"
          :bordered="false"
        />
      </div>
      <span v-if="poapStore.poaps.length == 0">You dont have any POAP drops yet.</span>
      <Btn type="primary" @click="router.push('create-poap')">Create new poap</Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';
import { h } from 'vue';
import { DataTableColumns, NButton, NDropdown } from 'naive-ui';

useNuxtApp();
const router = useRouter();
const pagination = false;
const { data: walletClient, refetch } = useWalletClient();
const { isConnected } = useAccount();

const jwt = ref();
const poapStore = usePoapDropStore();
const modalCreatePoapDrop = ref<boolean>(false);

const { connect, connectors } = useConnect({
  onSuccess() {
    console.log('connected');
  },
});

const columns: DataTableColumns<any> = [
  {
    title: 'Title',
    key: 'title',
    minWidth: 150,
  },
  {
    title: 'Description',
    key: 'description',
  },
  {
    key: 'startTime',
    title: 'Start date',
    minWidth: 200,
    render(row: any) {
      return h('span', {}, { default: () => datetimeToDateAndTime(row.startTime.toString()) });
    },
  },
  {
    key: 'endTime',
    title: 'End date',
    minWidth: 200,
    render(row: any) {
      return h('span', {}, { default: () => datetimeToDateAndTime(row.endTime.toString()) });
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'right',
    className: '!py-0',
    render(row: any) {
      return h(
        NDropdown,
        {
          options: dropdownOptions(row),
          trigger: 'click',
        },
        {
          default: () =>
            h(
              NButton,
              { type: 'tertiary', size: 'small', quaternary: true, round: true },
              {
                default: () =>
                  h(resolveComponent('NuxtIcon'), { name: 'more', class: 'text-xl' }, ''),
              }
            ),
        }
      );
    },
  },
];

useHead({
  title: 'Apillon Proof of attendance prebuilt solution',
  titleTemplate: '',
});

const dropdownOptions = (poapDrop: any) => {
  return [
    {
      label: 'View',
      key: 'view',
      props: {
        onClick: () => {
          navigateToPoapDrop(poapDrop);
        },
      },
    },
  ];
};

/* onMounted(() => {
  if (jwt.value) {
    poapStore.getPoapDrops();
  }
}); */

async function login() {
  if (!isConnected.value) {
    await connect({ connector: connectors.value[0] });
  } else {
    await refetch();
    if (!walletClient.value) {
      alert('walletNotConnected');
      return;
    }
    console.log(walletClient.value);
    const timestamp = new Date().getTime();
    const message = 'test';

    const signature = await walletClient.value.signMessage({ message: `${message}\n${timestamp}` });
    const res = await $api.post('/login', {
      signature,
      timestamp,
    });
    jwt.value = res.data.jwt;
    if (jwt.value) {
      $api.setToken(jwt.value);
      poapStore.getPoapDrops();
    }
  }
}
function navigateToPoapDrop(poapDrop: any) {
  router.push(`/poaps/${poapDrop.id}`);
}
</script>
