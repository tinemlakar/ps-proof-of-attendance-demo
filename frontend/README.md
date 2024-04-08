# Proof of attendance prebuilt solution - frontend

This repository contains source code for POA website.

## Overview

Solution has 2 main parts. Admin dashboard and page for NFT(POAPs) claim.
In admin dashboard, admin manages it's events, see their status, statistic, ...
Admin can create new POAP event, set its title, start and end time and link it with existing NFT collection created in Apillon platform.

Second part of solution is website which is meant to be displayed at the event.
Flow:

- User scans qr code from page
- Qr code contains URL to page, where user enter its email
- Email with instructions and link for mint is sent to that address
- User navigates to minting page, connects his wallet and mint NFT to it
- Recieved NFT is a POA

## Stack

- node >= 18.16.1
- Nuxt 3
- Vue 3 w/ TypeScript
- Pinia Store
- NaiveUI
- TailwindCSS

## Local development

Before uploading the website to (Apillon) hosting, feel free to edit the code, add any customization or just review whether everything works as expected.

To preview the website on your computer you need to serve a http server from the root folder of the website. For example, you can run node package http-server from root folder like this:

```sh
npm install
npm run dev
```

## Deploy to Apillon Hosting

To deploy the website on Apillon hosting you need to build project with a command below:

```sh
npm run generate
```

And then deploy folder **dist** according to this documentation: [Wiki](https://wiki.apillon.io/build/3-hosting-api.html)

### Basic

1. If not already, register to [Apillon.io](https://app.apillon.io)
2. Log in to Apillon console and create new website inside your project.
3. Select all files of your website (as configured in the previous step) and use drag&drop action to pull the files into the Hosting bucket
4. Once the files are uploaded, push them to Staging and finally to the Production
5. Add your custom domain (as displayed in the dashboards UI)
6. Review your newly deployed website

### Advanced

To deploy your website to Apillon Hosting you should:

1. Clone this repository and [configure](#configure) it to your needs.
2. If not already, register to [Apillon.io](https://app.apillon.io)
3. Log in to Apillon console and create new website inside your project.
4. In settings, create an API KEY with storage permissions. Write down API key and API secret.
5. In your github repository setup actions secrets (variables)
   - WEBSITE_UUID : copy UUID from website overview in Apillon dashboard
   - APILLON_API_KEY : your previously created API key
   - APILLON_API_SECRET : your previously created API secret

Now everything should be ready. When you will push to master branch, your website should start deploy to Apillon IPFS hosting. Monitor progress on [Apillon.io](https://app.apillon.io) dashboard. After some time you'll be able to get IPNS url and also setup your own domain.

You can change behavior of the automatic deployment by editing [../.github/workflows/deploy.yml](../.github/workflows/deploy.yml).

## Info

### Naive UI

[Naive UI](https://www.naiveui.com/en-US/os-theme) is used for default frontend components.

Its styles can be modified globally in `/lib/config/naive.ts` - [docs](https://www.naiveui.com/en-US/os-theme/docs/customize-theme#Customizing-theme-vars-in-TypeScript).

Each naive component also has the `:theme-overrides` prop to overwrite styles per specific usage.

```html
<n-tabs
  type="segment"
  size="small"
  :theme-overrides="{ panePaddingSmall: '1.5rem 0 0 0' }"
></n-tabs>
```

### API

API interaction should be done with api wrapper globally imported as `$api` (`/lib/utils/api.ts`).

API global interceptors (onRequest, onResponse, onForbidden) are also defined in `/lib/utils/api.ts`.

Api requests throw errors, handle them with try catches. `useHandleError(e)` can be used for general error handling (eg. toast display).

```js
try {
  await $api.post('/login', formData);
} catch (e: any) {
  useHandleError(e);
}
```

### Vueuse

Many common tasks can be solved with using helper functions from [vueuse](https://vueuse.org/functions.html). Use those instead of reinventing the wheel.

eg.

```js
useIntersectionObserver();
useInfiniteScroll();
useScroll();
useScrollLock();
```

### Icons

Add icon svg to `/assets/icons`, then use `<NuxtIcon :name="" />` component to use the icon - set name prop to filename. Implements [nuxt-icons](https://github.com/gitFoxCode/nuxt-icons).

Control size with font-size.

```html
<NuxtIcon name="close" class="inline-block text-[18px] mr-3 align-middle" />
```

### Breakpoints

For basic styles, use tailwind breakpoint system. For js usage, use `useScreen` composable.

```js
const screens = reactive(useScreen());
// or
const { isXl } = useScreen();
```

```html
<div v-if="screens.isXl" class="w-8 h-8 bg-red"></div>
<div v-else class="w-8 h-8 bg-blue"></div>
```

### Modal

Implements naive-ui modal.

```html
<Modal v-model:show="isModal" title="MY Modal">
  <div>ETC</div>
</Modal>
```

## Wallet / Crypto

Wallet integration can be implemented with [use-wagmi](https://github.com/unicape/use-wagmi) and [viem](https://viem.sh/). Docs for wagmi: [docs](https://wagmi.sh/react/getting-started) (react docs, but most hooks are supported).

Check for implementation on branch `crypto`.
Configuration is in `/plugins/use-wagmi.ts`.
Helpers are in `/composables/blockchain/**` and `/components/parts/Wallet/**`.

## Translations

Use [Nuxt i18n](https://github.com/nuxt-modules/i18n).

Check for implementation on branch `i18n`. Basically:

- install module and add config to `nuxt.config.ts`
- add translation json file: `/locales/en.json`
- add language switch component

### Usage

In template

```handlebars
{{ $t('investments.details.opensOn') }}
```

In script

```js
const { t } = useI18n();
const label = t('investments.details.location');
```

Internal links can be simple paths if using `strategy: 'no_prefix'`. Otherwise `localePath()` helper should be used.
