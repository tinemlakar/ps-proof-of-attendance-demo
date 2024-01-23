<template>
  <div>
    <div v-if="isLoggedIn" class="grid justify-items-center">
      <h1>Existing POAP drops</h1>
      <div v-if="poapStore.poaps" class="flex flex-col mt-8">
        <div v-if="poapStore.poaps?.items?.length != 0">
          <n-data-table
            :columns="columns"
            :data="poapStore.poaps.items"
            :pagination="pagination"
            :bordered="false"
            :row-props="rowProps"
            @update:page="handlePageChange"
          />
        </div>
        <span v-if="poapStore.poaps.items.length == 0">You dont have any POAP drops yet.</span>
        <Btn type="primary" class="mt-8" @click="router.push('create-poap')">Create new poap</Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount } from 'use-wagmi';
import { h } from 'vue';
import { DataTableColumns, NButton, NDropdown, PaginationProps } from 'naive-ui';
import { ON_COLUMN_CLICK_OPEN_CLASS, PAGINATION_LIMIT } from '~/lib/values/general.values';

useNuxtApp();
const router = useRouter();
const { isConnected } = useAccount();
const userStore = useUserStore();
const poapStore = usePoapDropStore();

const isLoggedIn = computed(() => isConnected.value && userStore.jwt);

onMounted(async () => {
  if (isLoggedIn.value) {
    await poapStore.getPoapDrops();
  }
});

watch(
  () => isLoggedIn.value,
  async _ => {
    if (isLoggedIn.value) {
      await poapStore.getPoapDrops();
    }
  }
);

const pagination = computed(() => {
  return {
    pageSize: PAGINATION_LIMIT,
  };
});
const columns: DataTableColumns<any> = [
  {
    title: 'Title',
    key: 'title',
    minWidth: 150,
    className: ON_COLUMN_CLICK_OPEN_CLASS,
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
                default: () => h(resolveComponent('i'), { class: 'icon-more text-xl' }, ''),
              }
            ),
        }
      );
    },
  },
];

function rowProps(row: any) {
  return {
    onClick: (e: Event) => {
      console.info('row', row);
      if (canOpenColumnCell(e.composedPath())) {
        navigateToPoapDrop(row);
      }
    },
  };
}

async function handlePageChange(currentPage: number) {
  await poapStore.getPoapDrops({ page: currentPage });
}

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

function navigateToPoapDrop(poapDrop: any) {
  router.push(`/poaps/${poapDrop.id}`);
}
</script>
