<template>
  <v-card :loading="loadingCupBoardNumber">
    <v-data-iterator
      :items="cupBoardArray"
      :items-per-page="2"
      :search="search"
      show-select
    >
      <template v-slot:header>
        <v-card class="px-2 bg-grey-lighten-3" color="miniBG" height="90">
          <v-container>
            <v-row>
              <v-col cols="2">
                <v-text-field
                  v-model="search"
                  clearable
                  density="comfortable"
                  hide-details
                  placeholder="Search"
                  prepend-inner-icon="mdi-magnify"
                  style="max-width: 300px;height: 60px"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-select
                  chips
                  label="待取"
                  clearable
                  :items=UserPass
                  style="max-width: 300px;height: 60px"
                  variant="outlined"
                  v-model="UserPassSearch"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  chips
                  label="待还"
                  clearable
                  :items=UserOut
                  style="max-width: 300px;height: 60px"
                  variant="outlined"
                  v-model="UserOutSearch"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-btn variant="outlined" height="55px" :loading="loading" @click="LoadCardNo">
                  刷卡
                </v-btn>
              </v-col>
              <v-col cols="1" v-if="useUserDataStore().UserData.authority=='root'">
                <v-btn variant="outlined" height="55px" :loading="loading" @click="Scheduler.monitorDrawer = true">
                  监视
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <monitor-scheduler></monitor-scheduler>
      </template>

      <template v-slot:default="{ items }">
        <v-container class="cupBoard pa-2" fluid>
          <v-row no-gutters>
            <v-col cols="6"
                   v-for="item in items"
                   :key="item.raw.cupBoardIndex">
              <cup-board :cupBoardArray="item.raw" style="margin-right: 10px"></cup-board>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            icon="mdi-arrow-left"
            density="comfortable"
            variant="tonal"
            rounded
            @click="prevPage"
          ></v-btn>

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn
            :disabled="page >= pageCount"
            icon="mdi-arrow-right"
            density="comfortable"
            variant="tonal"
            rounded
            @click="nextPage"
          ></v-btn>
        </div>
      </template>
    </v-data-iterator>
  </v-card>
  <v-dialog
    v-model="useCupBoardStore().dialog"
    width="auto"
    persistent
  >
    <v-card
      max-width="400"
    >
      <v-card-text>
        <v-progress-circular
          :width="4"
          color="green"
          indeterminate
        ></v-progress-circular>
        {{ useCupBoardStore().dialogTips }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import CupBoard from "../../components/cupBoard.vue";
import { CupBoardArray } from '../../type'
import { onBeforeUnmount, onMounted, Ref, watch } from 'vue'
import { useUserDataStore } from '../../store/useUserDataStore'
import { useLotusCardDriverStore } from '../../store/useLotusCardDriverStore'
import { useSystemInfoStore } from '../../store/useSystemInfoStore'
import { useCupBoardStore } from '../../store/useCupBoardStore'
import { useSystemSettingStore } from '../../store/useSystemSettingStore'
import { useSchedulerStore } from '../../store/useSchedulerStore'

const Scheduler = useSchedulerStore()

useSystemInfoStore().GetSystemInfo().then((info)=>{
  CupBoardNumber.value = info.cupboard_num
  cupBoardArray.value = []
  for (let i = 1;i<=CupBoardNumber.value;i++){
    let cupBoxLeftArray:string[] = []
    let cupBoxRightArray:string[] = []
    for (let j=1;j<=12;j++){
      if(j<=6){
        cupBoxLeftArray.push(i.toString().padStart(2, '0')+j.toString().padStart(2, '0'))
      }else {
        cupBoxRightArray.push(i.toString().padStart(2, '0')+j.toString().padStart(2, '0'))
      }
    }
    cupBoardArray.value.push(
      {
        cupBoardIndex:i.toString(),
        cupBoxLeftArray: cupBoxLeftArray,
        cupBoxRightArray: cupBoxRightArray
      }
    )
  }
  loadingCupBoardNumber.value = false
})

const search = ref("")
const UserPass:Ref<string[]> = ref([""])
const UserOut:Ref<string[]> = ref([""])
const UserPassSearch:Ref<string|null> = ref(null)
const UserOutSearch:Ref<string|null> = ref(null)
const cupBoardArray:Ref<CupBoardArray[]> = ref([])
const loading = ref(false)
const CupBoardNumber = ref(6)
const loadingCupBoardNumber = ref(true)
let Interval:any;

watch(UserPassSearch,(state,_pre)=>{
  if(state!=_pre && state != null){
    UserOutSearch.value = null
    search.value = state
  }
})

useUserDataStore().$subscribe((_args,state)=>{
  UserPass.value = state.UserPass.CupBoard
  UserOut.value = state.UserOut.CupBoard
})

useLotusCardDriverStore().$subscribe((_args,state)=>{
  if(state.CardNo!="-1"){
    useUserDataStore().GetUserData("","",state.CardNo)
    console.log(state.CardNo)
  }
  if(state.CardNo=="-1"&&Interval!=null){
    clearInterval(Interval)
    Interval = null
    useLotusCardDriverStore().Clear()
    useUserDataStore().Clear()
    useLotusCardDriverStore().Beep(200)
  }
})

function LoadCardNo(){
  loading.value = true
  useLotusCardDriverStore().Clear()
  useUserDataStore().Clear()
  useLotusCardDriverStore().OpenDriver()
  setTimeout(()=>{
    if(useLotusCardDriverStore().Result=='设备打开失败!'){
      loading.value = false
    }
    else {
      loading.value = false
      useLotusCardDriverStore().UpdateCardNo()
      Interval = setInterval(()=>{
        useLotusCardDriverStore().UpdateCardNoSilence()
      },5000)
    }
  },500)
}

onMounted(()=>{
  if(useSystemSettingStore().SystemSetting['源柜通讯设置']['仅启用源柜页面'].value){
    useSystemSettingStore().ShowLeftDrawer=false
    watch(()=>useUserDataStore().UserData.authority,(now,_pre)=>{
      if(now=='root') useSystemSettingStore().ShowLeftDrawer=true
    },{ once: true })
  }
  useSchedulerStore().loopFlagForStart = true
  useSchedulerStore().start()
})

onBeforeUnmount(()=>{
  useSchedulerStore().loopFlagForStart = false
})
</script>

<style scoped>
.cupBoard {
  max-width: 100%;
}
</style>
