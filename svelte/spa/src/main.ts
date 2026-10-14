import { initializePicard } from 'picard-js/client'
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
})

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
