<template>
  <v-card style="margin: 10px; padding: 10px;height: 1000px">
    <v-data-iterator :items="sources"
                     :items-per-page=30
                     search="true"
                     :custom-filter="customFilter"
                     :no-filter="filter">
      <template v-slot:header>
        <v-card class="px-2" style="height: 80px;padding-top: 20px" color="miniBG">
          <v-row no-gutters>
            <v-col cols="2">
              <v-text-field
                v-model="search"
                clearable
                density="comfortable"
                hide-details
                placeholder="搜索"
                label="搜索"
                prepend-inner-icon="mdi-magnify"
                style="max-width: 300px;"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn
                class="mx-4"
                variant="outlined"
                @click="useAddSourceStore().OpenAddSource = true;useAddSourceStore().RefreshSSID()">
                测试
              </v-btn>
            </v-col>
            <v-col cols="2">
              <el-cascader
                v-model="fill_value"
                :options="fill_options"
                :props="fill_props"
                @change="fill_handleChange"
                collapse-tags
                collapse-tags-tooltip
                clearable
                placeholder="筛选"
                style="width: 240px;"
                size="large"
              />
            </v-col>
            <v-col cols="1">
              <v-text-field
                v-model="nuclide_rate_search_input_min"
                :counter="10"
                spellcheck ="false"
                variant="outlined"
                placeholder="3.756E8"
                :error-messages="nuclide_rateFormatCheck(nuclide_rate_search_input_min)"
                label="活度最小值"
                style="width: 240px"
                clearable
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-text-field
                v-model="nuclide_rate_search_input_max"
                :counter="10"
                spellcheck ="false"
                variant="outlined"
                placeholder="3.756E8"
                :error-messages="nuclide_rateFormatCheck(nuclide_rate_search_input_max)"
                label="活度最大值"
                style="width: 240px"
                class="mx-10"
                clearable
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:default="{ items }">
        <el-scrollbar height="860px" style="padding-left: 50px;" >
          <v-container class="pa-2" fluid>
            <v-row dense >
              <v-col
                v-for="source_item in items"
                :key="source_item.raw.SSID"
                cols="auto"
                md="4"
              >
                <SourceCard :source_item="source_item.raw"></SourceCard>
              </v-col>
            </v-row>
          </v-container >
        </el-scrollbar>
      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            density="comfortable"
            icon="mdi-arrow-left"
            variant="tonal"
            rounded
            @click="prevPage"
          ></v-btn>

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn
            :disabled="page >= pageCount"
            density="comfortable"
            icon="mdi-arrow-right"
            variant="tonal"
            rounded
            @click="nextPage"
          ></v-btn>
        </div>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script setup lang="ts">
import { SourcesArray, SourcesFilterBufferArray } from '../type'
import SourceCard from './SourceCard.vue'
// import {useAddSourceStore} from '../store/useAddSourceStore'
import { Ref, ref, watch } from 'vue'
import { useAddSourceStore } from '../store/useAddSourceStore'

const search = ref(null)
const filter = ref(false)
const filter_buffer:Ref<SourcesFilterBufferArray> = ref({
  nuclide_index:[],
  nuclide: [],
  nuclide_name: [],
  nuclide_quality: [],
  nuclide_rate: [],
  nuclide_type: [],
  SSID: [],
  SourceStatus: [],
})

//**********************输入活度范围筛选功能**************************//
const nuclide_rate_search_input_min:Ref<string> = ref('')
const nuclide_rate_search_input_max:Ref<string> = ref('')

const nuclide_rateFormatCheck = (value: any)=> {  //*************活度范围输入格式审查函数
  if (value?.length >= 1 && /[0-9]+(.[0-9]+)?E[0-9]+/.test(value)) return null
  else if (value == '') return null
  else if (value == null) return null
  return '格式错误 参考 3.29E8 或 2E4'
}

const nuclide_rateSearchPush = ()=> {
  if (nuclide_rate_search_input_min.value != '' && nuclide_rateFormatCheck(nuclide_rate_search_input_min.value) == null
   && nuclide_rate_search_input_max.value != '' && nuclide_rateFormatCheck(nuclide_rate_search_input_max.value) == null
   && parseFloat(nuclide_rate_search_input_min.value) < parseFloat(nuclide_rate_search_input_max.value))
  {
    filter_buffer.value.nuclide_rate = []
    filter_buffer.value['nuclide_rate'].push([nuclide_rate_search_input_min.value,nuclide_rate_search_input_max.value] as never)
  }
}

watch(nuclide_rate_search_input_min,()=>{
  nuclide_rateSearchPush()
})
watch(nuclide_rate_search_input_max,()=>{
  nuclide_rateSearchPush()
})
//**********************输入活度范围筛选功能结尾**************************//

defineProps<{
  sources: SourcesArray[]
}>()

const customFilter = (_value: string, _query: string, _item?: any)=>{
  let Correct = 1

  const filter_key = Object.entries(filter_buffer.value)

  for (let i = 0;i<filter_key.length;i++){ //**********待重构**********//
    const filter_key_length = filter_key[i][1].length
    if(filter_key_length>0){
      let Correct_else = 0
      if (filter_key[i][0] == 'nuclide_rate') { //放射性活度筛选
        for (let j = 0; j < filter_key_length; j++) {
          if (parseFloat(_item.raw[filter_key[i][0]]) >= filter_key[i][1][j][0] && parseFloat(_item.raw[filter_key[i][0]]) <= filter_key[i][1][j][1]) {
            Correct_else += 1
          } else {
            Correct_else += 0
          }
        }
      } else { //其他筛选
        for (let j = 0; j < filter_key_length; j++) {
          if (typeof _item.raw[filter_key[i][0]] == typeof filter_key[i][1][j] && _item.raw[filter_key[i][0]] == filter_key[i][1][j]) {
            Correct_else += 1
          } else {
            Correct_else += 0
          }
        }
      }
      Correct *= Correct_else
    }
  }

  if(search.value!=null){
    const str:string = search.value
    if(str.length>0) {
      if(search.value!=_value){
        Correct*=0
      }
    }
  }
  return Correct==1
}

const fill_value = ref([])

const fill_props = {
  expandTrigger: 'hover' as const,
  multiple: true
}

const fill_handleChange = (_value) => {
   //console.log(_value)
}

const fill_options = [
  {
    value: 'nuclide_quality',
    label: '质量',
    children: [
      {
        value: 60,
        label: '60',
      },
      {
        value: 137,
        label: '137',
      },
    ],
  },
  {
    value: 'nuclide_type',
    label: '类型',
    children: [
      {
        value: 'EC',
        label: 'EC',
      },
      {
        value:'α',
        label: 'α',
      },
      {
        value:'β',
        label: 'β',
      },
    ],
  },
  //*********************通过筛选框对活度进行筛选****************************//
  // {
  //   value: 'nuclide_rate',
  //   label: '放射性活度',
  //   children: [
  //     {
  //       value: [1,10000000],
  //       label: '1~1E7',
  //     },
  //     {
  //       value: [10000000,1000000000],
  //       label: '1E7~1E9',
  //     }
  //   ]
  // }
]

watch(fill_value,(now,_pre)=>{
  //*********************通过筛选框对活度进行筛选*************************//
  // filter_buffer.value = {
  //   nuclide_index:[],
  //   nuclide: [],
  //   nuclide_name: [],
  //   nuclide_quality: [],
  //   nuclide_rate: [],
  //   nuclide_type: [],
  //   SSID: [],
  //   SourceStatus: [],
  // }
  //*********************通过输入值对活度进行筛选*************************//
  filter_buffer.value.nuclide_index = []
  filter_buffer.value.nuclide = []
  filter_buffer.value.nuclide_name = []
  filter_buffer.value.nuclide_quality = []
  filter_buffer.value.nuclide_type = []
  filter_buffer.value.SSID = []
  filter_buffer.value.SourceStatus = []
  now.forEach((item,_index)=>{
    filter_buffer.value[item[0] as string].push(item[1])
  })
})

</script>

<style scoped>
</style>
