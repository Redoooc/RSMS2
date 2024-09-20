<template>
  <v-card
    class="mx-auto"
    elevation="0"
    rounded="0">
    <v-card-text>
      <v-container>
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
import { ref } from 'vue'
import { useAddDeviceStore } from '../../store/useAddDeviceStore'
import { useSystemInfoStore } from '../../store/useSystemInfoStore'
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
  useAddDeviceStore().device_list_data = {
    device_id: useAddDeviceStore().device_id,
    SSID: useAddDeviceStore().SSID,
    wiz_ip: Ip.value,
    wiz_port: Port.value,
  }
  useBoardTCPStore().CreatSocket(0, '192.168.0.100', 5000)
  loading.value = true
  useAddDeviceStore().CanClose = false
  const InitCallback = useBoardTCPStore().InitBoard(0,Ip.value,Port.value,timeStamp.value)
  InitCallback.then((resolve)=>{
    if(resolve){
      const Callback = useAddDeviceStore().Add_device_list()
      Callback.then((resolve)=>{
        if(resolve[0].affectedRows==1){
          useSystemInfoStore().UpdateSystemInfoIpRange(1).then((resolve)=>{
            if (resolve[0].affectedRows==1){
              loading.value = false
              useBoardTCPStore().DropSocket(0)
              useAddDeviceStore().step = 2
            }
            else {
              BtnTips.value = "failed"
              loading.value = false
              color.value = "red"
            }
            setTimeout(()=>{
              color.value = "primary"
              BtnTips.value = "Next"
              useAddDeviceStore().CanClose = true
            },2000)
          })
        }
        else {
          BtnTips.value = "failed"
          loading.value = false
          color.value = "red"
        }
        setTimeout(()=>{
          color.value = "primary"
          BtnTips.value = "Next"
          useAddDeviceStore().CanClose = true
        },2000)
      })
    }
    else {
      BtnTips.value = "failed"
      loading.value = false
      color.value = "red"
    }
    setTimeout(()=>{
      color.value = "primary"
      useAddDeviceStore().CanClose = true
      BtnTips.value = "Next"
    },2000)
  })
}
function Close(){
  useBoardTCPStore().DropSocket(0)
  useAddDeviceStore().$reset()
}
</script>

<style scoped>

</style>
