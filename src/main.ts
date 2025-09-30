import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'; // Importation des icônes
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import App from './App.vue'
import router from './router'

const app = createApp(App);

const customLightTheme = {
  dark: false,
  colors: {
    primary: '#1a3682',
    secondary: '#fbba00',
  }
}

const customDarkTheme = {
  dark: true,
  colors: {
    primary: '#1a3682',
    secondary: '#fbba00',
  }
}

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  },
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme,
      customDarkTheme
    }
  }
})

app.use(createPinia());
app.use(vuetify);
app.use(router);

app.mount('#app');
