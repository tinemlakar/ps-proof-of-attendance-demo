<template>
  <div class="grid justify-items-center">
    <h1>{{ title }}</h1>
    <div v-if="currStep == 1" class="flex flex-col mt-8" style="width: 600px">
      <p>Select existing NFT collection on Apillon</p>
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

      <Btn size="small" type="primary" class="mt-12" @click="validateFormAndProceed()">Next</Btn>
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
        <n-form-item path="website" label="Website" :label-props="{ for: 'website' }">
          <n-input v-model:value="formData.website" clearable />
        </n-form-item>
      </n-form>
      <Btn size="small" type="primary" class="mt-12" @click="validateFormAndProceed()">Next</Btn>
    </div>
    <div v-if="currStep == 3" class="flex flex-col pt-8" style="width: 600px">
      <p>Here is the overview of the POAP drop:</p>
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
          <span class="font-bold">Event end date: </span
          ><span>{{ dateToDateTime(new Date(formData.endTime)) }}</span>
        </div>
      </div>
      <Btn size="small" type="primary" class="mt-12" :loading="loading" @click="createPoapDrop()"
        >Create</Btn
      >
    </div>
    <div v-if="currStep == 4" class="max-w-md w-full md:px-6 my-12 mx-auto">
      <img :src="SuccessSVG" class="mx-auto" width="165" height="169" alt="airdrop" />

      <div class="my-8 text-center">
        <h3 class="mb-6">Great Success!</h3>
        <p>
          POAP event was successfuly deployed. <br />
          Open the management for the POAP here:
        </p>
      </div>

      <Btn size="large" @click="manageCreatedPoap()"> Manage POAP </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormValidationError } from 'naive-ui/es/form';
import SuccessSVG from '~/assets/images/success.svg';

const { handleError } = useErrors();
const { currStep, formData, rules, formRef } = usePoapDrop();
const router = useRouter();
const message = useMessage();

const collections = ref();
const loading = ref(false);

let createdPoapDrop: any;
let title = 'Create new POAP drop';

onMounted(async () => {
  await getCollections();
});

async function getCollections() {
  const res = await $api.get('/nft-collections');
  collections.value = (res as any).data.items;
}

function validateFormAndProceed() {
  if (currStep.value === 1) {
    if (formData.collectionUuid) currStep.value++;
    else {
      message.warning('Please select NFT collection, that will be used for drop');
    }
  } else if (currStep.value === 2) {
    formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
      if (errors) {
        errors.map(fieldErrors =>
          fieldErrors.map(error => message.warning(error.message || 'Error'))
        );
      } else {
        currStep.value = 3;
      }
    });
  }
}

async function createPoapDrop() {
  loading.value = true;
  try {
    const res = await $api.put<any>(`/poap-drops`, {
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
    });
    loading.value = false;
    // router.push('');
    currStep.value = 4;
    title = 'POAP drop ready';
    createdPoapDrop = res.data;
  } catch (error) {
    handleError(error, 'Error creating new POAP');
    loading.value = false;
  }
}

function manageCreatedPoap() {
  if (createdPoapDrop) {
    router.push(`/poaps/${createdPoapDrop.id}`);
  }
}
</script>
