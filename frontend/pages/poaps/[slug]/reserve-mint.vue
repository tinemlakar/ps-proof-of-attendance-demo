<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <span>
      {{ expireIn }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const router = useRouter();
const { params, query } = useRoute();
const poapStore = usePoapDropStore();
const qrCodeInterval: any = null as any;
const expireIn = ref('');

const poapId = ref<string>(`${params?.slug}`);
const token = query.token;

onMounted(async () => {
  const decoded = jwtDecode(token);
  console.info(decoded);

  const tokenIssueDate = dayjs(decoded.iat * 1000);
  // Token should not be older than 7 seconds (7000 ms)
  if (dayjs() - tokenIssueDate > 7000) {
    console.log('Token is too old!');
  } else {
    console.log('Token is OK!');
  }
  console.info('diff', dayjs() - tokenIssueDate);
});
</script>
