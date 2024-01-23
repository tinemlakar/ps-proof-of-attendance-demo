import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { Environments } from './lib/values/general.values';
import { getConfig } from './lib/utils/utils';

const env = process.env.ENV ? process.env.ENV : process.env.NODE_ENV;

const CONFIG = getConfig();

const meta = {
  title: 'Apillon POA prebuild solution',
  description: 'Apillon proof of attendance',
  url: 'https://apillon.io/',
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      API_BASE: CONFIG.API_BASE || 'http://localhost:3001/',
      ENV: env || Environments.dev,
    },
  },

  components: ['~/components/general', '~/components/parts'],

  imports: {
    dirs: ['composables/', 'composables/stores/**', 'lib/utils/**'],
  },

  modules: [
    ['@nuxtjs/tailwindcss', { cssPath: '~/assets/styles/index.css' }],
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'nuxt-icons',
    '@nuxtjs/google-fonts',
  ],

  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],
      }),

      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],

    optimizeDeps: {
      include:
        // must use NODE_ENV (to build production version with dev config)
        process.env.NODE_ENV === Environments.dev ? ['naive-ui', 'vueuc'] : [],
    },
  },

  build: {
    transpile:
      // must use NODE_ENV (to build production version with dev config)
      process.env.NODE_ENV === Environments.prod
        ? ['naive-ui', 'vueuc', '@css-render/vue3-ssr', '@juggle/resize-observer']
        : ['@juggle/resize-observer'],
  },
  ssr: false,
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      bodyAttrs: { id: 'kalm' },
      title: meta.title,
      titleTemplate: `%s - ${meta.title}`,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no',

      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#070707' },
        { name: 'description', content: meta.description, hid: 'description' },
        { name: 'og:title', content: meta.title, hid: 'og:title' },
        { name: 'og:description', content: meta.description, hid: 'og:description' },
        { name: 'og:url', content: meta.url, hid: 'og:url' },
        // { name: 'og:image', content: meta.image },
        { name: 'og:type', content: 'website' },
        { name: 'twitter:title', content: meta.title, hid: 'twitter:title' },
        { name: 'twitter:description', content: meta.description, hid: 'twitter:description' },
        { name: 'twitter:url', content: meta.url, hid: 'twitter:url' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],

      link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.png' }],
    },
  },

  googleFonts: {
    useStylesheet: true,
    display: 'swap',
    download: false,
    families: {
      Inter: {
        wght: [400],
      },
      'IBM Plex Sans': {
        wght: [400, 700],
      },
    },
  },

  devtools: { enabled: true },
});
