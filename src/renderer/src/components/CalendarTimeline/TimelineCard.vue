<template>
  <v-card style="padding:40px;width:920px;height:980px">
    <v-card style="width:840px;height:900px;" elevation="0">
      <perfect-scrollbar>
        <x-gantt :data="dataList"
                 locale="zh-cn"
                 unit="hour"
                 primary-color="#2C3E50"
                 :header-style="HeaderStyle"
                 row-height="40">   <!--component:@xpyjs/gantt，Use as Gantt in main.ts，Reference:https://xpyjs.github.io/gantt/docs/-->
          <x-gantt-column prop="Sources" width="120" label="源"/>
          <x-gantt-slider prop="username"/>
        </x-gantt>
      </perfect-scrollbar>
      <AutoInputSourceData/>
      <AutoInputApplyData/>
      <AutoInputUserDataForAdministrator v-if="useUserDataStore().UserData.authority=='root'"/>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ApplyArray, SourcesArray } from '../../type'
import { useUserDataStore } from '../../store/useUserDataStore'
const moment = require('moment')

const HeaderStyle = { textColor:'White' }  //Change the text color of the timeline (Gantt chart) header

const Prop = defineProps<{
  _ApplyList:ApplyArray[]
  _SourceArray:SourcesArray[]
}>()

const dataList:Ref<any[]> = ref([]);
const YesterdayTime = moment().subtract({d:1}).format('YYYY-MM-DD HH:mm:ss')
function AutoInputSourceData() {  //Synchronize the data on the source_list
  Prop._SourceArray.forEach((_SourceArray) => {
    if (_SourceArray.nuclide != 'tmp') {
      dataList.value.push({
        SSID: _SourceArray.SSID,
        Sources: _SourceArray.nuclide_name + _SourceArray.nuclide_quality + ' No.' + _SourceArray.nuclide_id,
        startDate: moment(YesterdayTime).add({d:1}),
        endDate: moment(YesterdayTime).add({d:1}),
        username: '',
      })
    }
  })
}
function AutoInputApplyData() {  //Synchronize the data on the apply_list，If this function is not encapsulated separately from AutoInputSourceData() and called separately in the <Template>, there will be a situation where the source_list data is added repeatedly, and the reason is unknown
  Prop._ApplyList.forEach((_ApplyList) => {
    if (moment(_ApplyList.first_time).isAfter(YesterdayTime) && _ApplyList.apply_status == 'process-pass' && _ApplyList.event_status != 'back') {  //Judgment criteria: The application has been approved within the past 24 hours and has not been returned yet
      dataList.value.find((_dataList) => { return _dataList.SSID == _ApplyList.SSID }).startDate = _ApplyList.first_time
      dataList.value.find((_dataList) => { return _dataList.SSID == _ApplyList.SSID }).endDate = _ApplyList.last_time
    }
  })
}
function AutoInputUserDataForAdministrator(){  //When viewing the timeline (Gantt chart) as an administrator, show the id number who borrow the source
  Prop._ApplyList.forEach((_ApplyList) => {
    if (moment(_ApplyList.first_time).isAfter(YesterdayTime) && _ApplyList.apply_status == 'process-pass' && _ApplyList.event_status != 'back') {  //Judgment criteria: The application has been approved within the past 24 hours and has not been returned yet
      dataList.value.find((_dataList) => { return _dataList.SSID == _ApplyList.SSID }).username = _ApplyList.user
    }
  })
}

watch(useUserDataStore(),()=>{  //监视用户状态
  if(useUserDataStore().UserData.authority=="root"){  //当前登录用户为管理员
    AutoInputUserDataForAdministrator()
  }
  else if(useUserDataStore().UserData.name==""){  //退出登录时触发该项
    dataList.value.forEach((_dataList) => {
      _dataList.username = ''
    })
  }
})
</script>

<style scoped>
.ps {
  height: 900px;
}
</style>
