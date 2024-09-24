/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import EChart from 'vue-echarts'
import 'echarts'
import { VCalendar } from 'vuetify/labs/VCalendar'
import FullCalendar from '@fullcalendar/vue3'
import VueStatusIndicator from './components/VueStatusIndicator/VueStatusIndicator.vue'
import Gantt from '@xpyjs/gantt'
import '@xpyjs/gantt/dist/style.css'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.component('v-chart', EChart)
   .component('VCalendar', VCalendar)
   .component('FullCalendar', FullCalendar)
   .component('v-status', VueStatusIndicator)
app.use(Gantt)
app.mount('#app')
