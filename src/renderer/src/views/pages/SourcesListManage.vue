<template>
<v-card title="源管理">
  <template v-slot:text>
    <v-data-table
      height="860px"
      :headers="headers"
      :items="SourcesArray"
      :sort-by="[{ key: 'nuclide', order: 'desc' }]">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>放射源数据库</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog
            v-model="dialog"
            max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ chooseItem.nuclide}} No.{{chooseItem.nuclide_id}}</span>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="3">
                    <v-text-field
                      v-model="chooseItem.SSID"
                      variant="outlined"
                      spellcheck ="false"
                      disabled
                      label="SSID">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="chooseItem.nuclide"
                      variant="outlined"
                      label="源">
                    </v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="chooseItem.nuclide_id"
                      variant="outlined"
                      spellcheck ="false"
                      label="编号">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="chooseItem.nuclide_name"
                      variant="outlined"
                      spellcheck ="false"
                      label="名称">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="chooseItem.nuclide_index"
                      variant="outlined"
                      spellcheck ="false"
                      label="核序数">
                    </v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="chooseItem.nuclide_quality"
                      variant="outlined"
                      spellcheck ="false"
                      label="质量数">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="chooseItem.nuclide_rate"
                      variant="outlined"
                      spellcheck ="false"
                      label="出厂活度">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="chooseItem.nuclide_energy"
                      variant="outlined"
                      spellcheck ="false"
                      label="能量">
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="chooseItem.nuclide_type"
                      variant="outlined"
                      item-title="title"
                      item-value="value"
                      persistent-hint
                      label="衰变类型"
                      :items="[{ title:'轨道电子俘获',value:'EC'}, {title:'α衰变',value:'α'}, {title:'β衰变',value:'β'}]"
                    ></v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="chooseItem.SourceStatus"
                      variant="outlined"
                      item-title="title"
                      item-value="value"
                      persistent-hint
                      label="状态"
                      :items="[{ title:'在库',value:'READY'}, {title:'离库',value:'OUT'}, {title:'异常',value:'ALARM'}, {title:'待审',value:'PROCESS'}, {title:'待取',value:'PROCESS-PASS'}]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="chooseItem.device_id"
                      variant="outlined"
                      item-title="title"
                      item-value="value"
                      persistent-hint
                      label="设备绑定"
                      :items="DeviceArrayItem"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="cancel">
                  取消
                </v-btn>
                <v-btn
                  :loading="saveLoading"
                  color="blue-darken-1"
                  variant="text"
                  @click="saveSourceData">
                  {{ saveTips }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </template>
</v-card>
</template>

<script lang="ts" setup>
import { useManageStore } from '../../store/useManageStore'
// import { toRaw } from "@vue/reactivity"
import { Ref } from 'vue'
import { SourcesArray,DeviceArray } from '../../type'

const stateText:{ [KEY:string]: string} = {
  'READY': '在库',
  'OUT': '离库',
  'ALARM': '异常',
  'PROCESS': '待审',
  'PROCESS-PASS': '待取',
}

const typeText:{ [KEY:string]: string} = {
  'EC': '轨道电子俘获',
  'α': 'α衰变',
  'β': 'β衰变',
}

const headers:any = [
  {
    title: 'SSID',
    align: 'start',
    sortable: false,
    key: 'SSID'
  },
  { title: '源', key: 'nuclide' },
  { title: '编号', key: 'nuclide_id' },
  { title: '名称', key: 'nuclide_name' },
  { title: '核序数', key: 'nuclide_index' },
  { title: '质量数', key: 'nuclide_quality' },
  { title: '出厂活度', key: 'nuclide_rate' },
  { title: '衰变类型', key: 'nuclide_type', value:item => `${typeText[item.nuclide_type]}` },
  { title: '能量', key: 'nuclide_energy' },
  { title: '状态', key: 'SourceStatus', value:item => `${stateText[item.SourceStatus]}` },
  { title: '绑定', key: 'device_id', value:item => `${item.device_id==0?'未绑定':"设备:"+item.device_id+"(源柜:"+item.cupbox_id+")"}` },
  { title: '操作', key: 'actions', sortable: false }
]

const SourcesArray:Ref<SourcesArray[]> = ref([])
const DeviceArray: Ref<DeviceArray[]> = ref([])
const DeviceArrayItem: Ref<{ title:string,value:string,value2:string }[]>  = ref([])

const dialog = ref(false)
const saveLoading = ref(false)
const saveTips = ref("保存")
const chooseItem:Ref<SourcesArray> = ref({} as SourcesArray)

const editItem = async(item) => {
  await getUnusedDevice().then(()=>{
    chooseItem.value = Object.assign({}, item)
  })
}
const cancel = () => {
  dialog.value = false
  chooseItem.value = {} as SourcesArray
}
const saveSourceData = () => {
  chooseItem.value.cupbox_id = DeviceArrayItem.value.find((item)=>{return item.value = String(chooseItem.value.device_id)})!.value2 //无设备接入时，该行会报错，有设备接入时尚未测试
  saveLoading.value = true
  setTimeout(()=>{
    useManageStore().ChangeSource(chooseItem.value.SSID,chooseItem.value)
      .then(()=>{
        useManageStore().ManageGetSourcesList().then((resolve)=>{
          SourcesArray.value = resolve
          for(let i=0;i<SourcesArray.value.length;i++){
            const item_object:SourcesArray = SourcesArray.value[i]
            useManageStore().FindBand(item_object.SSID).then((res:{device_id:string,cupbox_id:string})=>{
              SourcesArray.value[i].device_id = Number(res.device_id)
              SourcesArray.value[i].cupbox_id = res.cupbox_id
            })
          }
        })
        .then(()=>{
          const check = SourcesArray.value.find((user)=>{return user.SSID==chooseItem.value.SSID})
          if(CheckObject(check!,chooseItem.value,["nuclide_energy","device_id","cupbox_id"])){
            saveLoading.value = false
            saveTips.value = "完成"
            setTimeout(() => {
              saveTips.value = "保存"
            },500)
          }else {
            saveLoading.value = false
            saveTips.value = "超时"
            setTimeout(() => {
              saveTips.value = "保存"
            },500)
          }
        })
    })
  },500)
}

useManageStore().ManageGetSourcesList().then((resolve)=>{
  SourcesArray.value = resolve
  for(let i=0;i<SourcesArray.value.length;i++){
    const item_object:SourcesArray = SourcesArray.value[i]
    useManageStore().FindBand(item_object.SSID).then((res:{device_id:string,cupbox_id:string})=>{
      SourcesArray.value[i].device_id = Number(res.device_id)
      SourcesArray.value[i].cupbox_id = res.cupbox_id
    })
  }
})

const CheckObject = (objectA:object,objectB:object,filter:string[]):boolean =>{
  let Correct = 1
  const keys = Object.entries(objectA)
  for (let i = 0;i<keys.length;i++){
    if(filter.includes(keys[i][0])){Correct*=1}
    else{
      if(typeof objectB[keys[i][0]] == typeof keys[i][1] && objectB[keys[i][0]]==keys[i][1]){Correct*=1}
      else {
        console.log(objectB[keys[i][0]])
        Correct*=0}
    }
  }
  return Correct==1
}

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
        dialog.value = true
      }
  })
}
</script>
