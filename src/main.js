import { createApp } from 'vue'
import App from './App.vue'
import './main.scss'
import 'focus-visible'
import router from './routes'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import { api, supabase } from './services'

const app = createApp(App)

// Disponibiliza os serviços globalmente
app.config.globalProperties.$api = api
app.config.globalProperties.$supabase = supabase

app.use(router)
app.component('Toaster', Toaster)
app.mount('#app')
