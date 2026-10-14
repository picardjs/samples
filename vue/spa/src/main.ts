import { initializePicard } from 'picard-js/client'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
})

createApp(App).mount('#app')
