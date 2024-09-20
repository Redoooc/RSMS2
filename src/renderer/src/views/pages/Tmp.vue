<template>
  <v-btn :loading="loading" @click="openDev">调试</v-btn>
  <v-btn :loading="loading" @click="tmp">跳转
  </v-btn>
  <v-btn :loading="loading" @click="code=useTmpSafeCodeStore().GetCode()">随机Code:{{ code }}</v-btn>
  <v-btn :loading="loading" @click="tmpB">自回调计数</v-btn>
  <v-btn :loading="loading" @click="tmpC">
    调度器单次获取计数{{ moment.unix(CallBack[0]).format('HH:mm:ss') }},计数率{{ CallBack[1] }}CPS
  </v-btn>
  <v-btn :loading="loading" @click="tmpD">调度器状态</v-btn>
  <v-btn :loading="loading" @click="tmpE">调度器启动</v-btn>
  <v-btn :loading="loading" @click="tmpF">添加调度</v-btn>
  <v-btn :loading="loading" @click="tmpG">监视</v-btn>
  <v-btn @click=" $i18n.locale=$i18n.locale=='en'?'zhHans':'en' ">
    切换语言 {{ $t('tmp.hello') }}
  </v-btn>
  <v-btn :loading="loading" @click="()=>{useAddDeviceStore().OpenAddDevice=true;useAddDeviceStore().RefreshDeviceID()}">
    添加设备
  </v-btn>
  <v-text-field v-model="ip" variant="outlined" style="width: 150px"></v-text-field>

  <monitor-scheduler></monitor-scheduler>
  <AddDevice></AddDevice>
  <v-container class="fill-height background">
    <v-responsive class="align-center text-center fill-height">
      <v-img height="400" src="@/assets/scdx.svg" />
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">


import router from '../../router'
import { useBoardTCPStore } from '../../store/useBoardTCPStore'
import { useTmpSafeCodeStore } from '../../store/useTmpSafeCodeStore'
import { useAddDeviceStore } from '../../store/useAddDeviceStore'
import { useSchedulerStore } from '../../store/useSchedulerStore'

const loading = ref(false)
const ip = ref('192.168.0.101')
const CallBack = ref([0, 0])
const moment = require('moment')

const code = ref('')
const Scheduler = useSchedulerStore()

const Function = async (Value: any, ID: number) => {
  return new Promise(resolve => {
    useBoardTCPStore().CreatSocket(ID, Value.ip, Value.port)
    useBoardTCPStore().GetCount(ID)
      .then(async (res: any) => {
        for (let tick = 0; tick < 200; tick++) {
          if (typeof res != 'string' && res != null) {
            // console.log("already wait at " + tick as unknown as string)
            return res
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
  })
}

function openDev() {
  window.api.openDev()
}

function tmp() {
  router.addRoute({path: '/CupboardListManage',name: 'CupboardListManage',
    meta: {
      requiresAuth: true,
      layout: 'TmpEcharts'
    },component: () => import('./CupboardListManage.vue')})
  router.replace('/CupboardListManage')
}

function tmpB() {
  useBoardTCPStore().CreatSocket(0, ip.value, 5000)
  useBoardTCPStore().GetCount(0)
    .then(async (res: any) => {
      try {
        for (let tick = 0; tick < 200; tick++) {
          if (res[0]) {
            // console.log("already wait at "+tick as unknown as string)
            return res
          }
          await new Promise(resolve => setTimeout(resolve, 10))
        }
        return [0, 0]
      } catch (err) {
        return [0, 0]
      }
    })
    .then(async (_res) => {
      _res[0] == 0 ? (await new Promise(resolve => setTimeout(resolve, 50))) : true
      useBoardTCPStore().DropSocket(0)
      console.log(_res)
      if (_res != null && typeof _res != 'string') CallBack.value = _res
    })
    .then(() => {
      tmpB()
    })
}

async function tmpC() {
  Scheduler.add(Function, {
    ip: ip.value,
    port: 5000
  }, {
    delay: 0
  })
    .then((_r) => {
      console.log(_r)
      if (_r != null && typeof _r != 'string') {
        CallBack.value = _r
      }
    })
}

function tmpD() {
  Function({
    ip: ip.value,
    port: 5000
  }, 0).then((r) => {
    console.log(r)
  })
}

function tmpE() {
  Scheduler.start()
  console.log(Scheduler.queue0cache)
}

function tmpF() {
  for (let i = 0; i < 12000; i++) {
    const res = Scheduler.add(
      Function,
      {
        ip: ip.value,
        port: 5000
      },
      {
        delay: 0
      })
    res.then((r) => {
      console.log(r)
      if (r != null && typeof r != 'string') CallBack.value = r
    })
  }

}

async function tmpG() {
  Scheduler.monitorDrawer = true
}

</script>

<style scoped>

</style>
