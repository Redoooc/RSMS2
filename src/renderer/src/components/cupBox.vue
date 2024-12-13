<template>
  <v-card v-if="useUserDataStore().UserStatus=='Login'&&UserInfo.user==useUserDataStore().UserData.user&&UserInfo.event_status=='wait'" variant="outlined" style="border-width: 5px;border-color:#76FF03" class="mx-auto" width="auto" height="100px">
    <v-row no-gutters>
      <v-col cols="5">
        <v-card class="mx-auto" width="auto" height="100px" prepend-icon="mdi-box" flat
                elevation="0">
          <template v-slot:title>
            {{ cupBoxIndex }}
          </template>
          <v-card-text v-if="SourcesInfo.nuclide_quality!=0&&SourcesInfo.nuclide_quality!=undefined">{{SourcesInfo.nuclide_name +` `+SourcesInfo.nuclide+` `+SourcesInfo.nuclide_quality+` `+`No.`+SourcesInfo.nuclide_id }}
          </v-card-text>
          <v-card-text v-else-if="SourcesInfo.device_id!='0000'">{{`设备ID:`+` `+SourcesInfo.device_id }}
          </v-card-text>
          <v-card-text v-else>{{`未绑定` }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card class="mx-auto" width="auto" height="100px" flat
                elevation="0">
          <v-row style="margin-top: 15px;margin-right: 10px" no-gutters>
            <v-col cols="12" class="text-center">
              <v-tooltip
                :text="moment.unix(callback[0]).format('YYYY-MM-DD HH:mm:ss') as string"
                activator="parent"
                location="bottom">
                <template v-slot:activator="{ props }">
                  <v-status v-bind:props :type="ChannelStatusType(ChannelStatus)"></v-status>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-card-text v-if="SourcesInfo.nuclide_quality!=0&&SourcesInfo.nuclide_quality!=undefined">
                <h4 class="text-h6">
                  {{callback[1]}}
                </h4>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto" width="auto" height="100px" flat
                elevation="0">
          <v-btn
            style="margin: 10px;width: 70px;height: 70px;"
            variant="outlined"
          @click="OpenBox(UserInfo.apply_id,UserInfo.SSID)">
            借取
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else-if="useUserDataStore().UserStatus=='Login'&&UserInfo.user==useUserDataStore().UserData.user&&UserInfo.event_status=='out'" variant="outlined" style="border-width: 5px;border-color:#1E88E5" class="mx-auto" width="auto" height="100px">
    <v-row no-gutters>
      <v-col cols="5">
        <v-card class="mx-auto" width="auto" height="100px" prepend-icon="mdi-box" flat
                elevation="0">
          <template v-slot:title>
            {{ cupBoxIndex }}
          </template>
          <v-card-text v-if="SourcesInfo.nuclide_quality!=0&&SourcesInfo.nuclide_quality!=undefined">{{SourcesInfo.nuclide_name +` `+SourcesInfo.nuclide+` `+SourcesInfo.nuclide_quality+` `+`No.`+SourcesInfo.nuclide_id }}
          </v-card-text>
          <v-card-text v-else-if="SourcesInfo.device_id!='0000'">{{`设备ID:`+` `+SourcesInfo.device_id }}
          </v-card-text>
          <v-card-text v-else>{{`未绑定` }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card class="mx-auto" width="auto" height="100px" flat
                elevation="0">
          <v-row style="margin-top: 15px;margin-right: 10px" no-gutters>
            <v-col cols="12" class="text-center">
              <v-tooltip
                :text="moment.unix(callback[0]).format('YYYY-MM-DD HH:mm:ss') as string"
                activator="parent"
                location="bottom">
                <template v-slot:activator="{ props }">
                  <v-status v-bind:props :type="ChannelStatusType(ChannelStatus)"></v-status>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-card-text v-if="SourcesInfo.nuclide_quality!=0&&SourcesInfo.nuclide_quality!=undefined">
                <h4 class="text-h6">
                  {{callback[1]}}
                </h4>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto" width="auto" height="100px" flat
                elevation="0">
          <v-btn
            style="margin: 10px;width: 70px;height: 70px;"
            variant="outlined"
            @click="BackOpenBox(UserInfo.apply_id,UserInfo.SSID)">
            归还
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else :loading = "BoxLoading" variant="outlined" style="border-width: 2px;" v-bind:style="{borderColor:Color[SourcesInfo.SourceStatus]}" class="mx-auto" width="auto" height="100px"
  >
    <v-row no-gutters>
      <v-col cols="5">
        <v-card class="mx-auto" flat width="auto" height="100px" prepend-icon="mdi-box"
                elevation="0">
          <template v-slot:title>
            {{ cupBoxIndex }}
          </template>
          <v-card-text v-if="SourcesInfo.nuclide_quality!=0&&SourcesInfo.nuclide_quality!=undefined">{{SourcesInfo.nuclide_name +` `+SourcesInfo.nuclide+` `+SourcesInfo.nuclide_quality+` `+`No.`+SourcesInfo.nuclide_id }}
          </v-card-text>
          <v-card-text v-else-if="SourcesInfo.device_id!='0000'">{{`设备ID:`+` `+SourcesInfo.device_id }}
          </v-card-text>
          <v-card-text v-else>{{`未绑定` }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card class="mx-auto" width="auto" height="100px" flat
                elevation="0">
          <v-row style="margin-top: 15px;margin-right: 10px" no-gutters>
            <v-col cols="12" class="text-center">
              <v-tooltip
                :text="moment.unix(callback[0]).format('YYYY-MM-DD HH:mm:ss') as string"
                activator="parent"
                location="bottom">
                <template v-slot:activator="{ props }">
                  <v-status v-bind:props :type="ChannelStatusType(ChannelStatus)"></v-status>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-card-text v-if="SourcesInfo.nuclide_quality!=0&&SourcesInfo.nuclide_quality!=undefined">
                <h4 class="text-h6">
                  {{callback[1]}}
                </h4>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto" width="auto" height="100px" flat
                elevation="0">
          <v-btn v-if="useUserDataStore().UserData.authority=='root' && needResetTime"
            :loading="timeResettingStatus"
            style="margin: 10px;width: 70px;height: 70px;"
            variant="outlined"
            @click="clickToReSetBoardTime()">
            {{reSetTimeTips}}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import { CupBoxSource, CupBoxUserInfo } from '../type'
import { useAsyncUpdateCupBoardStore } from '../store/useAsyncUpdateCupBoardStore'
import { useCupBoardStore } from '../store/useCupBoardStore'
import { useUserDataStore } from '../store/useUserDataStore'
import { useSystemInfoStore } from '../store/useSystemInfoStore'
import { useSchedulerStore } from '../store/useSchedulerStore'
import { useBoardTCPStore } from '../store/useBoardTCPStore'
import { useSystemSettingStore } from '../store/useSystemSettingStore'
import VStatus from './VueStatusIndicator/VueStatusIndicator.vue'
import { useCounterSQLStore } from '../store/useCounterSQLStore'

const moment = require('moment')
const Props = defineProps<{
  cupBoxIndex:string,
}>()
const empty:CupBoxSource = {
  SourceStatus: 'OUT',
  nuclide_energy: [],
  nuclide_index: 0,
  nuclide_name: '',
  wiz_ip:"",
  wiz_port:0,
  nuclide_quality: 0,
  nuclide_id:0,
  nuclide_rate: '',
  nuclide_type: '',
  cupbox_id:'0',
  device_id: "0000",
  SSID:'0',
  nuclide:'empty'
}
const Color:{ [KEY:string]: string} = {
  'READY': '#00E676',
  'ALARM': '#FF3D00',
  'PROCESS': '#00B0FF',
  'PROCESS-PASS': '#00B0FF',
  'OUT': '#546E7A',
}
const callback:Ref<number[]> = ref([0,0,0])
const Scheduler = useSchedulerStore()
const IntervalID:Ref<NodeJS.Timeout|null> = ref(null)
const monitorIntervalID:Ref<NodeJS.Timeout|null> = ref(null)
const CounterSQLID = ref(-1)
const ChannelStatus = ref('none')
const bustSwitchCache = ref([0,0])
const busyTimes  = Math.round(((useSystemSettingStore().SystemSetting['源柜通讯设置']['调度器队列累计下限'].value)*(useSystemSettingStore().SystemSetting['源柜通讯设置']['单次调度最大超时时间'].value))/useSystemSettingStore().SystemSetting['源柜通讯设置']['请求调度最短时间'].value) + 2*(useSystemSettingStore().SystemSetting['源柜通讯设置']['单次调度最大超时时间'].value)/useSystemSettingStore().SystemSetting['源柜通讯设置']['请求调度最短时间'].value
const pushQueue : Ref<any[]> = ref([]) //queue of blocker
let needResetTime = ref(false)
let askResetTime = ref(false)
let timeResettingStatus = ref(false)
let reSetTimeTips = ref('校时')
let resTemp = ref(0)

const ChannelStatusType = (ChannelStatus)=>{
  switch(ChannelStatus){
    case 'success':
      return 'success'
    case 'none':
      return 'error'
    case 'busy':
      return 'warning'
    default:
      return 'error'
  }
}
const SourcesInfo:Ref<CupBoxSource> = ref(empty)
const UserInfo:Ref<CupBoxUserInfo> = ref({} as CupBoxUserInfo)
const BoxLoading = ref(true)

function clickToReSetBoardTime() {
  askResetTime.value= true
  timeResettingStatus.value = true
  setTimeout(()=>{
    askResetTime.value= false
    reSetTimeTips.value = '重试'
  },useSystemSettingStore().SystemSetting['探测器校时功能设置']['校时状态最大等待时间'].value * 750)
  setTimeout(()=>{ //At this time, although it is in the loading status, it is confirming whether the timing is successful through the timestamp returned by the GetCount() function
    timeResettingStatus.value = false
  },useSystemSettingStore().SystemSetting['探测器校时功能设置']['校时状态最大等待时间'].value * 1000)
}

const Function = async (Value: any, ID: number) => {
  return new Promise(resolve => {
    try{
      useBoardTCPStore().CreatSocket(ID, Value.ip, Value.port)
      useBoardTCPStore().GetCount(ID, useSystemSettingStore().SystemSetting['源柜通讯设置']['单次调度最大超时时间'].value)
        .then(async (res: any) => {
          for (let tick = 0; tick < 200; tick++) {
            if (typeof res != 'string' && res != null) {
              // console.log("already wait at " + tick as unknown as string)
              if (typeof res[2] == 'string' && res[2] == Value.ip) {
                return res.splice(0,2)
              }
            } else {
              await new Promise(resolve => setTimeout(resolve, 10))
            }
          }
          return [0, 0]
        })
        .then(async (_res) => {
          useBoardTCPStore().DropSocket(ID)
          resolve(_res)
        })
    }catch (_e) {
      resolve ([0, 0])
    }
  })
}

const ReSetTimeFunction = async (Value: any, ID: number) => {
  return new Promise(resolve => {
    try {
      useBoardTCPStore().CreatSocket(ID, Value.ip, Value.port)
      useBoardTCPStore().ReSetTime(ID, moment().unix(), useSystemSettingStore().SystemSetting['探测器校时功能设置']['单次校时指令超时时间'].value)
        .then((_res)=>{
          if (_res == true){
            askResetTime.value = false
            needResetTime.value = false
          }
          useBoardTCPStore().DropSocket(ID)
          resolve(_res)
            })
    } catch (_e) {
      console.error('ReSetTimeFunction:', _e)
      resolve(undefined)
    }
  })
}

const OnceCount = (ip: string)=>{
  if(askResetTime.value) {
    Scheduler.add(
      ReSetTimeFunction,
      {
        ip: ip,
        port: 5000
      },
      {
        delay: 0
      })
  } else {
    if (typeof callback.value[0] == 'number') {
      const res = Scheduler.add(
        Function,
        {
          ip: ip,
          port: 5000
        },
        {
          delay: 0
        })
      res.then(async (r) => {
        if (r != null && typeof r != 'string' && typeof r[0] == 'number' && r[0] != 0) {
          callback.value = r
          callback.value[2] = moment().unix()
          needResetTime.value = callback.value[0] < callback.value[2] - (useSystemSettingStore().SystemSetting['探测器校时功能设置']['校时提示检测阈值'].value*60) // check if we need to reset board time or not
          if (r[0] != resTemp.value) { //1 data per second
            resTemp.value = r[0]
            if (pushQueue.value.length != 0) { //Blocker, used to deal with occasional concurrent situations in writing data to log file
              await new Promise(resolve => {
                pushQueue.value.splice(pushQueue.value.length - 1, 0, { resolve: resolve })
              })
            } else { // the first task don't have Blocker and resolve()
              pushQueue.value.push({
                resolve: () => {
                }
              }) //empty function
            }
            await useCounterSQLStore().pushCounterData(CounterSQLID.value, r[0], r[1])
            pushQueue.value.shift().resolve()
          }
        }
      })
      if (bustSwitchCache[1] == 0) {
        bustSwitchCache[0] = callback[0]
        bustSwitchCache[1]++
      } else if (bustSwitchCache[1] >= busyTimes) {
        ChannelStatus.value = bustSwitchCache[0] == callback[0] ? 'busy' : ChannelStatus.value
        bustSwitchCache[1] = 0
      } else {
        bustSwitchCache[1]++
      }
    } else {
      callback.value = [0, 0]
    }
  }
}

const IntervalCount = (ip: string)=>{
  IntervalID.value = setInterval(()=>{
    OnceCount(ip)
  },useSystemSettingStore().SystemSetting['源柜通讯设置']['请求调度最短时间'].value as number)
}

useAsyncUpdateCupBoardStore().CupboardUpdateBox(Props.cupBoxIndex).then((resolve)=>{
  if(resolve.Status){
    SourcesInfo.value = resolve.CallBack
    useAsyncUpdateCupBoardStore().CupboardUpdateBoxUserInfo(Props.cupBoxIndex).then((resolve)=>{
      if(resolve.Status){
        BoxLoading.value = false
        UserInfo.value = resolve.CallBack
      }
    })
  }
})

useUserDataStore().$subscribe((_args,_state)=>{
  useAsyncUpdateCupBoardStore().CupboardUpdateBox(Props.cupBoxIndex).then((resolve)=>{
    if(resolve.Status){
      SourcesInfo.value = resolve.CallBack
      useAsyncUpdateCupBoardStore().CupboardUpdateBoxUserInfo(Props.cupBoxIndex).then((resolve)=>{
        if(resolve.Status){
          BoxLoading.value = false
          UserInfo.value = resolve.CallBack
        }
      })
    }
  })
})

function OpenBox(apply_id:string,SSID:string){
  const open_time = moment().format("YYYY-MM-DD hh:mm:ss")
  useCupBoardStore().dialog = true
  useCupBoardStore().dialogTips = "更新系统信息中..."
  useSystemInfoStore().GetSystemInfo().then((resolve)=>{
    const SysInfo = resolve
    useCupBoardStore().dialogTips = "写入源柜信息中..."
    setTimeout(()=>{
      useCupBoardStore().AsyncOpen(open_time,apply_id,SSID).then((resolve)=>{
        if(resolve[0].affectedRows==1){
          useCupBoardStore().dialogTips = "更新源柜信息中..."
          useAsyncUpdateCupBoardStore().CupboardUpdateBox(Props.cupBoxIndex).then((resolve)=>{
            if(resolve.Status){
              SourcesInfo.value = resolve.CallBack
              useCupBoardStore().dialogTips = "初始化源柜连接中..."
              useCupBoardStore().AsyncCupBoardsInit(SysInfo.cupboard_num).then((_resolve)=>{
                if(_resolve){
                  useCupBoardStore().dialogTips = "打开源柜中..."
                  useCupBoardStore().AsyncOpenBox(Props.cupBoxIndex).then((_resolve)=>{
                    if(_resolve){
                      useCupBoardStore().dialogTips = "刷新源柜中..."
                      useAsyncUpdateCupBoardStore().CupboardUpdateBoxUserInfo(Props.cupBoxIndex).then((resolve)=>{
                        if(resolve.Status){
                          useCupBoardStore().dialogTips = "完成..."
                          useCupBoardStore().dialog = false
                          BoxLoading.value = false
                          UserInfo.value = resolve.CallBack
                        }
                        else {
                          useCupBoardStore().dialogTips = "刷新源柜出现错误..."
                          setTimeout(()=>{
                            useCupBoardStore().dialog = false
                          },1000)
                        }
                      })
                    }
                    else {
                      useCupBoardStore().dialogTips = "打开源柜出现错误..."
                      setTimeout(()=>{
                        useCupBoardStore().dialog = false
                      },1000)
                    }
                  })
                }else {
                  useCupBoardStore().dialogTips = "初始化源柜连接出现错误..."
                  setTimeout(()=>{
                    useCupBoardStore().dialog = false
                  },1000)
                }
              })
            }
            else {
              useCupBoardStore().dialogTips = "更新源柜信息出现错误..."
              setTimeout(()=>{
                useCupBoardStore().dialog = false
              },1000)
            }
          })
        }
        else {
          useCupBoardStore().dialogTips = "写入源柜信息出现错误..."
          setTimeout(()=>{
            useCupBoardStore().dialog = false
          },1000)
        }
      })
    },500)
  })
}

function BackOpenBox(apply_id:string,SSID:string){
  const back_time = moment().format("YYYY-MM-DD hh:mm:ss")
  useCupBoardStore().dialog = true
  useCupBoardStore().dialogTips = "更新系统信息中..."
  useSystemInfoStore().GetSystemInfo().then((resolve)=>{
    const SysInfo = resolve
    useCupBoardStore().dialogTips = "写入源柜信息中..."
    setTimeout(()=>{
      useCupBoardStore().AsyncBackOpen(back_time,apply_id,SSID).then((resolve)=>{
        if(resolve[0].affectedRows==1){
          useCupBoardStore().dialogTips = "更新源柜信息中..."
          useAsyncUpdateCupBoardStore().CupboardUpdateBox(Props.cupBoxIndex).then((resolve)=>{
            if(resolve.Status){
              SourcesInfo.value = resolve.CallBack
              useCupBoardStore().dialogTips = "初始化源柜连接中..."
              useCupBoardStore().AsyncCupBoardsInit(SysInfo.cupboard_num).then((_resolve)=>{
                if(_resolve){
                  useCupBoardStore().dialogTips = "打开源柜中..."
                  useCupBoardStore().AsyncOpenBox(Props.cupBoxIndex).then((_resolve)=>{
                    if(_resolve){
                      useCupBoardStore().dialogTips = "刷新源柜中..."
                      useAsyncUpdateCupBoardStore().CupboardUpdateBoxUserInfo(Props.cupBoxIndex).then((resolve)=>{
                        if(resolve.Status){
                          useCupBoardStore().dialogTips = "完成..."
                          useCupBoardStore().dialog = false
                          BoxLoading.value = false
                          UserInfo.value = resolve.CallBack
                        }
                        else {
                          useCupBoardStore().dialogTips = "刷新源柜出现错误..."
                          setTimeout(()=>{
                            useCupBoardStore().dialog = false
                          },1000)
                        }
                      })
                    }
                    else {
                      useCupBoardStore().dialogTips = "打开源柜出现错误..."
                      setTimeout(()=>{
                        useCupBoardStore().dialog = false
                      },1000)
                    }
                  })
                }else {
                  useCupBoardStore().dialogTips = "初始化源柜连接出现错误..."
                  setTimeout(()=>{
                    useCupBoardStore().dialog = false
                  },1000)
                }
              })
            }
            else {
              useCupBoardStore().dialogTips = "更新源柜信息出现错误..."
              setTimeout(()=>{
                useCupBoardStore().dialog = false
              },1000)
            }
          })
        }
        else {
          useCupBoardStore().dialogTips = "写入源柜信息出现错误..."
          setTimeout(()=>{
            useCupBoardStore().dialog = false
          },1000)
        }
      })
    },500)
  })
}

const GetCount = async (ip: string) => {
  IntervalCount(ip)
  monitorIntervalID.value = setInterval(()=>{
    if((callback.value[0]==0 && IntervalID.value!=null) || ((callback.value[2] < moment().unix()-useSystemSettingStore().SystemSetting['源柜通讯设置']['探测器连接超时检测时间'].value && IntervalID.value!=null))){
      clearInterval(IntervalID.value)
      IntervalID.value = null
      ChannelStatus.value='none'
    }
    else if(IntervalID.value==null){
      IntervalCount(ip)
    }
  },Math.random()*5000 + 5000)
  console.log(SourcesInfo.value.cupbox_id+" Start Get Count.Code is "+IntervalID.value as unknown as string)
}

onMounted(()=>{
  watch(callback,(_now,_pre)=>{
    ChannelStatus.value = _now[0] != 0?'success':'none'
  })
  watch(ChannelStatus,(_now,_pre)=>{
    if(_now!=_pre&&_now){
      if(useCounterSQLStore().availableChannel.findIndex(channel=>channel==SourcesInfo.value.cupbox_id)==-1){
        useCounterSQLStore().availableChannel.push(SourcesInfo.value.cupbox_id)
      }
    }
    if(_now!=_pre&&!_now){
      const id = useCounterSQLStore().availableChannel.findIndex(channel=>channel==SourcesInfo.value.cupbox_id)
      if(id!=-1){
        useCounterSQLStore().availableChannel.splice(id,1)
      }
    }
  })
  if(useSystemSettingStore().SystemSetting['源柜通讯设置']['启用调度'].value){
    watch(SourcesInfo,(now,_pre)=>{
      if(now.wiz_ip!=''){
        if(useCounterSQLStore().CupBoxCount.findIndex((item)=>item.CupBoxID==SourcesInfo.value.cupbox_id)==-1){
          useCounterSQLStore().CupBoxCount.push({
            CupBoxID:SourcesInfo.value.cupbox_id,
            CountBuff:[],
            WriteCount:0,
            ReadStatus:false
          })
        }
        CounterSQLID.value=useCounterSQLStore().CupBoxCount.findIndex((item)=>item.CupBoxID==SourcesInfo.value.cupbox_id)
        useCounterSQLStore().createFolder()
        GetCount(now.wiz_ip)
      }
    },{once:true})
  }
})

onBeforeUnmount(()=>{
  if(IntervalID.value!=null){
    console.log(SourcesInfo.value.cupbox_id+" Stop Get Count.Code is "+IntervalID.value as unknown as string)
    clearInterval(IntervalID.value)
    IntervalID.value = null
  }
  if(monitorIntervalID.value!=null){
    clearInterval(monitorIntervalID.value)
    monitorIntervalID.value = null
  }
})
</script>

<style>

</style>
