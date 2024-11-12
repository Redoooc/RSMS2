<template>
  <v-card style="padding:40px;width:880px;height:980px">
    <v-card style="width:800px;height:900px;" elevation="0">
      <perfect-scrollbar>
        <FullCalendar :options="calendarOptions" >
        </FullCalendar>
      </perfect-scrollbar>
    </v-card>
    <v-btn @click="AddEvent">添加事件</v-btn>
    <AutoAddEvent></AutoAddEvent>
  </v-card>
</template>

<script setup lang="ts">
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentPlugin from '@fullcalendar/moment'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import { ref, watch } from 'vue'
import { useUserDataStore } from '../../store/useUserDataStore'
import { ApplyArray, SourcesArray } from '../../type'

const Prop = defineProps<{
  _ApplyList:ApplyArray[]
  _SourceArray:SourcesArray[]
}>()

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, momentPlugin],
  droppable: true,
  height: 800,
  titleFormat: 'MM-DD',
  weekNumbers:false,
  dayMaxEventRows: true,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridDay,timeGridWeek,dayGridMonth',
  },
  nowIndicator: true,
  locale: zhCnLocale,
  events: [] as any[],
  views: {
    dayGrid: {
      displayEventTime:false,
    },
    timeGrid: {
    },
    week: {
      displayEventTime:false,
      displayEventEnd:false,
      eventMaxStack:4
    },
    day: {
      displayEventTime:true,
      displayEventEnd:true,
      eventMaxStack:6
    }
  }
})

function AddEvent(){
  calendarOptions.value.events.push(
    {
      title: 'The Title',
      SSID: '8021',
      start: '2024-09-21 15:30',
      end: '2024-09-22 19:30',
    }
  )
}
function AutoAddEvent(){  //Automatically synchronize approved apply to the applicant's calendar
  Prop._ApplyList.forEach((_ApplyList)=>{
    if (_ApplyList.user==useUserDataStore().UserData.user && _ApplyList.apply_status=='process-pass') {  //Filter the currently logged-in user's approved apply
      Prop._SourceArray.forEach((_SourceArray)=> {
        if (_SourceArray.SSID == _ApplyList.SSID) {  //Find the source corresponding to the SSID number of approved apply
          calendarOptions.value.events.push(
            {
              title: _SourceArray.nuclide_name+_SourceArray.nuclide_quality+' No.'+_SourceArray.nuclide_id,
              SSID: '8021',
              start: _ApplyList.first_time,
              end: _ApplyList.last_time,
            }
          )
        }
      })
    }
  })
}

//Switch calendar when account login or logout occurs on the calendar page(dashboard.vue)//
watch(useUserDataStore(),()=>{  //Monitor user status(login & logout)
  calendarOptions.value.events.splice(0,calendarOptions.value.events.length)  //Clear the calendar when account login and logout
  if(useUserDataStore().UserStatus=="Login"){ AutoAddEvent() }  //synchronize approved apply when account login
})
</script>

<style scoped>
.ps {
  height: 900px;
}
</style>
