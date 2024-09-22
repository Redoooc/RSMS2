<template>
<v-card
  class="pb-3"
  :ripple="false"
  border
  max-width="280px">
  <v-card-item>
    <template v-slot:subtitle>
      <div class="d-flex py-3 justify-space-between">
        <h4 class="text-h5">{{apply_item.apply_id}}</h4>
        <h4 :class="`text-h6 font-weight-bold ${statusSubtitleColor[apply_item.apply_status]}`">
          {{statusSubtitle[apply_item.apply_status]}}
        </h4>
      </div>
      <div class="d-flex py-3 justify-space-between">
        <v-row no-gutters >
          <v-col cols="4">
            <h4 class="text-h4">
              <v-icon
                icon="mdi-radioactive"
                size="32"
                color="black"
                class="me-1 pb-1"
              ></v-icon
              >{{apply_item.nuclide_name}}
            </h4>
          </v-col>
          <v-col cols="5">
            <h4 class="text-h6">
              No.{{apply_item.nuclide_id}}
            </h4>
          </v-col>
          <v-col cols="3">
            <h4 class="text-h4">
              {{apply_item.nuclide_quality}}
            </h4>
          </v-col>
        </v-row>
      </div>
    </template>
  </v-card-item>
  <v-card-text class="py-0">
    <v-row align="center" no-gutters>
      <h4 class="text-h7">
        {{apply_item.name}}
      </h4>
    </v-row>
    <v-row align="center" no-gutters>
      <h4 class="text-h7">
        {{apply_item.reason}}
      </h4>
    </v-row>
  </v-card-text>
  <v-divider></v-divider>

  <v-expand-transition>
    <div v-if="useSourceListStatusStore().Apply_expand === apply_item.apply_id">
      <v-list class="bg-transparent">
        <v-list-item
          title="申请时间"
          :subtitle="`${apply_item.first_time}`"
        >
        </v-list-item>
        <v-list-item
          title="预计归还时间"
          :subtitle="`${apply_item.last_time}`"
        >
        </v-list-item>
        <v-list-item
          v-if="apply_item.process_time!=null"
          title="审核时间"
          :subtitle="`${apply_item.process_time}`"
        >
        </v-list-item>
        <v-list-item
          v-if="apply_item.out_time!=null"
          title="离库时间"
          :subtitle="`${apply_item.out_time}`"
        >
        </v-list-item>
        <v-list-item
          v-if="apply_item.back_time!=null"
          title="归还时间"
          :subtitle="`${apply_item.back_time}`"
        >
        </v-list-item>
      </v-list>
    </div>
  </v-expand-transition>

  <v-card-actions>
    <v-row no-gutters>
      <v-col cols="4">
        <v-btn
          v-if="processStatus=='pass'+apply_item.apply_id"
          variant="outlined"
          elevation="4"
          color="green"
          :loading="PassLoading"
          @click="PASS(apply_item.apply_id)"
        >
          点击确认
        </v-btn>
        <v-btn
          v-else-if="apply_item.apply_status!='process'"
          variant="outlined"
          elevation="4"
          color="green"
          disabled
        >
          通过审核
        </v-btn>
        <v-btn
          v-else
          variant="outlined"
          elevation="4"
          color="green"
          @click="processStatus='pass'+apply_item.apply_id"
        >
          通过审核
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          v-if="processStatus=='pass'+apply_item.apply_id||processStatus=='forbid'+apply_item.apply_id"
          variant="outlined"
          elevation="4"
          @click="processStatus=''"
        >
          取消审核
        </v-btn>
        <v-btn
          v-else
          variant="outlined"
          elevation="4"
          @click="()=>{if(useSourceListStatusStore().Apply_expand !== apply_item.apply_id){useSourceListStatusStore().Apply_expand = apply_item.apply_id}else{useSourceListStatusStore().Apply_expand = ''}}"
        >
          {{ useSourceListStatusStore().Apply_expand!== apply_item.apply_id ? '更多信息' :
          '隐藏信息' }}
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          v-if="processStatus=='forbid'+apply_item.apply_id"
          variant="outlined"
          elevation="4"
          color="red"
          :loading="ForbidLoading"
          @click="FORBID(apply_item.apply_id)"
        >
          点击确认
        </v-btn>
        <v-btn
          v-else-if="apply_item.apply_status!='process'"
          variant="outlined"
          elevation="4"
          color="red"
          disabled
        >
          拒绝审核
        </v-btn>
        <v-btn
          v-else
          variant="outlined"
          elevation="4"
          color="red"
          @click="processStatus='forbid'+apply_item.apply_id"
        >
          拒绝审核
        </v-btn>
      </v-col>
    </v-row>
  </v-card-actions>

</v-card>
</template>

<script setup lang="ts">
import { ApplyArray } from '../type'
import { useSourceListStatusStore } from '../store/useSourceListStatusStore'
import { ref } from 'vue'
import { useUserProcessStore } from '../store/useUserProcessStore'
const moment = require('moment')

const PassLoading = ref(false)
const ForbidLoading = ref(false)
const processStatus = ref("")
const statusSubtitle:{ [KEY:string]: string} = {
  'process': '待审核',
  'process-pass': '申请通过',
  'process-forbid': '申请拒绝',
}
const statusSubtitleColor:{ [KEY:string]: string} = {
  'process': 'text-light-blue',
  'process-pass': 'text-light-green',
  'process-forbid': 'text-red',
}
defineProps<{
  apply_item:ApplyArray,
}>()

function PASS(apply_id:string){

  PassLoading.value = true
  useUserProcessStore().ApplyProcess('process-pass',moment().format("YYYY-MM-DD HH:mm:ss"),'wait',apply_id)
  setTimeout(()=>{
    useUserProcessStore().GetApply()
    setTimeout(()=>{
      if(useUserProcessStore().ApplyList.find((_apply)=>{return  _apply.apply_id==apply_id})!.apply_status=='process-pass'){
        PassLoading.value = false
        processStatus.value=''
      }else {
        PassLoading.value = false
        processStatus.value=''
      }
    },300)
  },200)
}
function FORBID(apply_id:string){
  ForbidLoading.value = true
  useUserProcessStore().ApplyProcess('process-forbid',moment().format("YYYY-MM-DD HH:mm:ss"),'normal',apply_id)
  setTimeout(()=>{
    useUserProcessStore().GetApply()
    setTimeout(()=>{
      if(useUserProcessStore().ApplyList.find((_apply)=>{return  _apply.apply_id==apply_id})!.apply_status=='process-forbid'){
        ForbidLoading.value = false
        processStatus.value=''
      }else {
        ForbidLoading.value = false
        processStatus.value=''
      }
    },300)
  },200)
}
</script>

<style scoped>
</style>
