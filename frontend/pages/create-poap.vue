<template>
  <div class="grid justify-items-center">
    <h1>Create new POAP drop</h1>
    <div v-if="currStep == 1" class="flex flex-col" style="width: 600px">
      <h2>Select existing NFT collection on Apillon</h2>
      <n-select
        v-model:value="formData.collectionUuid"
        class="mt-4"
        :options="collections"
        label-field="name"
        value-field="uuid"
      />

      <div v-if="collections && collections.length == 0" class="flex flex-col mt-6">
        <p>
          You dont have any NFT collections deployed via Apillon. Create a NFT collection first and
          return back to POAP drop deployment.
        </p>
        <a href="https://app.apillon.io/dashboard/service/nft" target="_blank"
          ><Btn size="small" type="primary">Go to apillon console</Btn>
        </a>
      </div>

      <Btn size="small" type="primary" class="mt-12" @click="currStep = 2">Next</Btn>
    </div>
    <div v-if="currStep == 2" class="flex flex-col" style="width: 600px">
      <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
        <!--  Project Quota value -->
        <n-form-item path="title" label="Title" :label-props="{ for: 'title' }">
          <n-input v-model:value="formData.title" clearable />
        </n-form-item>
        <n-form-item path="description" label="Description" :label-props="{ for: 'description' }">
          <n-input v-model:value="formData.description" clearable />
        </n-form-item>
        <n-form-item path="startTime" label="Start time" :label-props="{ for: 'startTime' }">
          <n-date-picker v-model:value="formData.startTime" type="datetime" clearable />
        </n-form-item>
        <n-form-item path="endTime" label="End time" :label-props="{ for: 'endTime' }">
          <n-date-picker v-model:value="formData.endTime" type="datetime" clearable />
        </n-form-item>
      </n-form>
      <Btn size="small" type="primary" class="mt-12" @click="currStep = 3">Next</Btn>
    </div>
    <div v-if="currStep == 3" class="flex flex-col" style="width: 600px">
      <p>Here is the overview of the deploy.</p>
      <div class="flex flex-col">
        <div>
          <span class="font-bold">Target NFT collection: </span
          ><span>{{ formData.collectionUuid }}</span>
        </div>
        <div>
          <span class="font-bold">Title: </span><span>{{ formData.title }}</span>
        </div>
        <div>
          <span class="font-bold">Description: </span><span>{{ formData.description }}</span>
        </div>
        <div>
          <span class="font-bold">Website: </span><span>{{ formData.website }}</span>
        </div>
        <div>
          <span class="font-bold">Event start date: </span
          ><span>{{ dateToDateTime(new Date(formData.startTime)) }}</span>
        </div>
        <div>
          <span class="font-bold">Event end date: </span>><span>{{
            dateToDateTime(new Date(formData.endTime))
          }}</span>
        </div>
      </div>
      <Btn size="small" type="primary" class="mt-12" @click="createPoapDrop()">Create</Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { currStep, formData, rules } = usePoapDrop();
const collections = ref();
const router = useRouter();

onMounted(async () => {
  await getCollections();
});

async function getCollections() {
  const res = await $api.get('/nft-collections');
  collections.value = (res as any).data.items;
}

async function createPoapDrop() {
  try {
    const res = await $api.put<any>(`/poap-drops`, {
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
    });
    console.info(res);
    router.push('');
  } catch (error) {
    // message.error(userFriendlyMsg(error));
  }
}
</script>
