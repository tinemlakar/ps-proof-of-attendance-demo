<template>
  <div v-if="poapStore.poap" class="grid justify-items-center">
    <h1>
      {{ poapStore.poap.title }}
    </h1>
    <span v-if="timeToEvent">Time to event: {{ timeToEvent.toString() }}</span>
    <div class="columns-2">
      <div>
        <h2>Website for QR scanning</h2>
      </div>
      <div>
        <h2>Website for NFT reservation</h2>
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

/** Website ID from route */
const poapId = ref<string>(`${params?.id}`);

onMounted(async () => {
  await poapStore.getPoapDrop(poapId.value);
  debugger;
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
