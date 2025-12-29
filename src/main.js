import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.scss'
import 'focus-visible'
import router from './routes'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const app = createApp(App)
app.use(router)
app.component('Toaster', Toaster)
app.mount('#app')
