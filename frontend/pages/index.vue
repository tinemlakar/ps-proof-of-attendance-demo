<template>
  <div class="grid justify-items-center">
    <div class="text-lg"><span>Proof of attendance</span></div>
    <div v-if="!isConnected">
      <Btn @click="connect({ connector: connectors[0] })">Connect wallet</Btn>
    </div>
    <div v-if="isConnected && !jwt">
      <Btn v-if="!items" type="primary" @click="login()">Login</Btn>
    </div>
    <div v-if="jwt">TODO: List existing POAPs</div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';
const items = ref(null);
const { vueApp } = useNuxtApp();
const { data: walletClient, refetch } = useWalletClient();
const { isConnected } = useAccount();

const jwt = ref();

const { connect, connectors } = useConnect({
  onSuccess() {
    console.log('connected');
  },
});

useHead({
  title: 'Apillon Proof of attendance prebuilt solution',
  titleTemplate: '',
});

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
    /* const res = await $api.post('/login', {
      signature,
      timestamp,
    }); */
    jwt.value = 'My jwt'; // res.data.jwt;
    /* if (jwt) {
      $api.setToken(jwt);
    } */
  }
}
</script>
