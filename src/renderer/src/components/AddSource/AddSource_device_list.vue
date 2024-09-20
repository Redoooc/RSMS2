<template>
  <v-card
    class="mx-auto"
    elevation="0"
    rounded="0">
    <v-card-text>
      <v-switch
        v-model="useAddSourceStore().BandOldDevice"
        label="绑定已有设备"
        :loading="OldDeviceLoading"
        inset
        color="red"
        spellcheck ="false"
        variant="outlined"
      ></v-switch>
      <v-container v-if="!useAddSourceStore().BandOldDevice">
        <v-row>
          <v-col cols="4">
            <v-btn
              @click="CheckBoard"
              :disabled="useBtn"
            >{{Tips}}</v-btn>
          </v-col>
          <v-col>

          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-text-field label="IP" v-model="Ip" :disabled="!InitDevice"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field label="Port" v-model="Port" :disabled="!InitDevice"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-btn @click=""></v-btn>
          </v-col>
          <v-col cols="9">
            <v-text-field disabled>{{timeStamp==0?"":moment.unix(timeStamp).format("YYYY-MM-DD HH:mm:ss")}}</v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else-if="!OldDeviceLoading">
        <v-select
          v-model="useAddSourceStore().device_id"
          variant="outlined"
          item-title="title"
          item-value="value"
          persistent-hint
          @change="console.log($event)"
          label="设备绑定"
          :items="DeviceArrayItem"
        ></v-select>
      </v-container>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn variant="text" @click="Close">Close</v-btn>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" :disabled="!CanSubmit" :color="color" variant="flat" @click="Submit">{{ BtnTips }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">

import { useBoardTCPStore } from '../../store/useBoardTCPStore'
import { Ref, ref, watch } from 'vue'
import { useAddSourceStore } from '../../store/useAddSourceStore'
import { useSourceArrayStore } from '../../store/useSourceArrayStore'
import { useSystemInfoStore } from '../../store/useSystemInfoStore'
import { useManageStore } from '../../store/useManageStore'
import { DeviceArray } from '../../type'
const moment = require("moment")

const useBtn = ref(false)
const InitDevice = ref(false)
const InitDeviceLoading = ref(false)
const Tips = ref("设备绑定检测")
const timeStamp = ref(0)
const loading = ref(false)
const color = ref("primary")
const BtnTips = ref("Next")
const CanSubmit = ref(false)
const Ip = ref("")
const Port = ref(0)
const OldDeviceLoading = ref(false)
const DeviceArray: Ref<DeviceArray[]> = ref([])
const DeviceArrayItem: Ref<{ title:string,value:string,value2:string }[]>  = ref([])

function CheckBoard(){
  let tik_time = 10
  const Tik = setInterval(()=>{
    Tips.value = "设备绑定检测中 " + tik_time.toString()+"s"
    tik_time -=1
  },1000)
  Tips.value = "设备绑定检测中 10s"
  useBtn.value = true
  InitDevice.value = false
  InitDeviceLoading.value = true
  useBoardTCPStore().CreatSocket(0, '192.168.0.100', 5000)
  const CheckCallback = useBoardTCPStore().CheckBoard(0)
  CheckCallback.then((resolve)=>{
    if(resolve){
      Tips.value = "设备正常"
      InitDevice.value = true
      InitDeviceLoading.value = false
      timeStamp.value = moment().format("X") as number
      CanSubmit.value = true
      useSystemInfoStore().GetSystemInfo().then((resolve)=>{
        Ip.value = resolve.ip_field + (resolve.ip_range + 1).toString()
        Port.value = resolve.port
      })
    }
    else {
      if(tik_time<=2){
        Tips.value = "连接超时"
      }else {
        Tips.value = "设备已被绑定"
      }
      InitDeviceLoading.value = false
      CanSubmit.value = false
      setTimeout(()=>{
        useBtn.value = false
        Tips.value = "设备绑定检测"
      },1500)
    }
    clearInterval(Tik)
  })
}
function Submit(){
  if(!useAddSourceStore().BandOldDevice){
    useAddSourceStore().device_list_data = {
      device_id: useAddSourceStore().device_id,
      SSID: useAddSourceStore().SSID,
      wiz_ip: Ip.value,
      wiz_port: Port.value,
    }
    useBoardTCPStore().CreatSocket(0, '192.168.0.100', 5000)
    loading.value = true
    useAddSourceStore().CanClose = false
    const InitCallback = useBoardTCPStore().InitBoard(0,Ip.value,Port.value,timeStamp.value)
    InitCallback.then((resolve)=>{
      if(resolve){
        const Callback = useAddSourceStore().Add_device_list()
        Callback.then((resolve)=>{
          if(resolve[0].affectedRows==1){
            useSystemInfoStore().UpdateSystemInfoIpRange(1).then((resolve)=>{
              if (resolve[0].affectedRows==1){
                loading.value = false
                useBoardTCPStore().DropSocket(0)
                useAddSourceStore().CanClose = false
                useAddSourceStore().step = 3
              }
              else {
                BtnTips.value = "failed"
                useAddSourceStore().CanClose = false
                loading.value = false
                color.value = "red"
              }
              setTimeout(()=>{
                useAddSourceStore().CanClose = false
                color.value = "primary"
                BtnTips.value = "Next"
              },2000)
            })
          }
          else {
            useAddSourceStore().CanClose = false
            BtnTips.value = "failed"
            loading.value = false
            color.value = "red"
          }
          setTimeout(()=>{
            useAddSourceStore().CanClose = false
            color.value = "primary"
            BtnTips.value = "Next"
          },2000)
        })
      }
      else {
        useAddSourceStore().CanClose = false
        BtnTips.value = "failed"
        loading.value = false
        color.value = "red"
      }
      setTimeout(()=>{
        useAddSourceStore().CanClose = false
        color.value = "primary"
        BtnTips.value = "Next"
      },2000)
    })
  }else {
    useAddSourceStore().device_list_data = {
      device_id: useAddSourceStore().device_id,
      SSID: useAddSourceStore().SSID,
      wiz_ip: "UNUSED",
      wiz_port: 0,
    }
    loading.value = true
    useAddSourceStore().CanClose = false
    const Callback = useAddSourceStore().Update_device_list()
    Callback.then((resolve)=>{
      if(resolve[0].affectedRows==1){
        useAddSourceStore().CanClose = true
        useAddSourceStore().step = 4
        setTimeout(()=>{
          useAddSourceStore().CanClose = true
          useAddSourceStore().$reset()
          color.value = "primary"
          BtnTips.value = "Next"
        },2000)
      }
      else {
        useAddSourceStore().CanClose = false
        BtnTips.value = "failed"
        loading.value = false
        color.value = "red"
      }
      setTimeout(()=>{
        useAddSourceStore().CanClose = false
        color.value = "primary"
        BtnTips.value = "Next"
      },2000)
    })
    setTimeout(()=>{
      useAddSourceStore().CanClose = false
      color.value = "primary"
      BtnTips.value = "Next"
    },2000)
  }
}

function Close(){
  if(useAddSourceStore().BandOldDevice || useAddSourceStore().SSID=='0'){
    useAddSourceStore().$reset()
  }
  else{
    useBoardTCPStore().DropSocket(0)
    if (!useAddSourceStore().CanClose) {
      const Callback = useAddSourceStore().Remove_sources_list()
      Callback.then((resolve) => {
        if (resolve[0].affectedRows == 1) {
          useSourceArrayStore().UpdateSourceArray()
          useAddSourceStore().$reset()
        }
      })
    } else {
      useAddSourceStore().$reset()
    }
  }
}

watch(() =>useAddSourceStore().BandOldDevice,(_now, _pre) => {
  OldDeviceLoading.value = true
  useAddSourceStore().device_id = ""
  if(_now&&!_pre){
    getUnusedDevice()
  }else {
    setTimeout(()=>{
      OldDeviceLoading.value = false
    },500)
  }
})
watch(()=>useAddSourceStore().device_id,(_now,_pre)=>{
  CanSubmit.value = DeviceArrayItem.value.filter((item)=>{return item.value==_now}).length>0
})

const getUnusedDevice = async() => {
  DeviceArray.value = []
  DeviceArrayItem.value = []
  useManageStore().ManageGetDeviceList().then((resolve:DeviceArray[]) => {
    const findResult:DeviceArray[] = toRaw(resolve.filter((item:DeviceArray) => {return item.SourceStatus=='NONE'}))
    if(findResult.length>=0){
      DeviceArray.value = findResult
      findResult.forEach((item:DeviceArray) => {
        DeviceArrayItem.value.push({title:"设备:"+item.device_id+"(源柜:"+item.cupbox_id+")",value:item.device_id,value2:item.cupbox_id})
      })
      setTimeout(()=>{
        OldDeviceLoading.value = false
      },500)
      console.log(DeviceArrayItem.value)
    }
  })
}

</script>

<style scoped>

</style>
