<template>
  <v-card style="padding:40px;width:920px;height:980px">
    <v-card style="width:840px;height:900px;" elevation="0">
      <perfect-scrollbar>
        <x-gantt :data="dataList"
                 locale="zh-cn"
                 unit="hour"
                 primary-color="#2C3E50"
                 :header-style="HeaderStyle"
                 row-height="40">   <!--使用的@xpyjs/gantt组件，见main.ts中的Gantt，参考文档https://xpyjs.github.io/gantt/docs/-->
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

const HeaderStyle = { textColor:'White' }  //修改时间线（甘特图）表头的文字颜色

const Prop = defineProps<{
  _ApplyList:ApplyArray[]
  _SourceArray:SourcesArray[]
}>()

const dataList:Ref<any[]> = ref([]);
const YesterdayTime = moment().subtract({d:1}).format('YYYY-MM-DD HH:mm:ss')
function AutoInputSourceData() {  //将source_list上的数据同步
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
function AutoInputApplyData() {  //将apply_list上的数据同步，该函数如不与AutoInputSourceData()分别封装并在Template中分别调用，会出现重复添加source_list数据的情况，原因不明
  Prop._ApplyList.forEach((_ApplyList) => {
    if (moment(_ApplyList.first_time).isAfter(YesterdayTime) && _ApplyList.apply_status == 'process-pass' && _ApplyList.event_status != 'back') {  //判断条件： 申请时间在过去的24小时内 且 申请通过 且 尚未归还
      dataList.value.find((_dataList) => { return _dataList.SSID == _ApplyList.SSID }).startDate = _ApplyList.first_time
      dataList.value.find((_dataList) => { return _dataList.SSID == _ApplyList.SSID }).endDate = _ApplyList.last_time
    }
  })
}
function AutoInputUserDataForAdministrator(){  //在以管理员身份查看时间轴（甘特图）时，将apply_list中的user(用户账号)同步
  Prop._ApplyList.forEach((_ApplyList) => {
    if (moment(_ApplyList.first_time).isAfter(YesterdayTime) && _ApplyList.apply_status == 'process-pass' && _ApplyList.event_status != 'back') {  //判断条件： 申请时间在过去的24小时内 且 申请通过 且 尚未归还
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
