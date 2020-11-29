import webpack from 'webpack'
export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Whiteboard',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css' }
    ],
    script: [
    ]
  },

  loading: {
    color: 'orange',
    height: '4px'
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'bootstrap/dist/css/bootstrap.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~plugins/bootstrap.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-sweetalert2',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyDmRoohEgKUVP5pXokWMXUbROXucwiqbPE',
          authDomain: 'whiteboard-41098.firebaseapp.com',
          databaseURL: 'https://whiteboard-41098.firebaseio.com',
          projectId: 'whiteboard-41098',
          storageBucket: 'whiteboard-41098.appspot.com',
          messagingSenderId: '158994526689',
          appId: '1:158994526689:web:73ab0cc78373b847b7a2a0',
          measurementId: 'G-SE42LC5BXM'
        },
        services: {
          auth: true,
          firestore: true
        }
      }
    ]
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    vendor: ['jquery', 'bootstrap'],
    plugins: [
      // set shortcuts as global for bootstrap
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  }
}
