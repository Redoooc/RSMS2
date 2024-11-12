<template>
  <v-select
    v-model="CupBoxID"
    :items="useCounterSQLStore().availableChannel"
    @click="updateEcharts"
  >
  </v-select>
  <v-chart style="height: 400px;" :option="option" @click=""></v-chart>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { readCounterData, useCounterSQLStore } from '../../store/useCounterSQLStore'

const data: Ref<any[]> = ref([])
const CupBoxID = ref('')
const option = ref(EchartsOption(data.value))

function EchartsOption(data,type?:'CountRate'|'ADCPulse'){
  const Empty = {}
  const CountRate = {
    title: {
      text: '计数率',
      left: '1%'
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '10%'
    },
    xAxis: {
      type: 'time',
      axisTick: {
        alignWithLabel: true
      },
    },
    yAxis: {},
    toolbox: {
      right: 10,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [
      {
        type: 'inside'
      },
      {
        handleIcon:
          'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z'
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    visualMap: {
      top: 50,
      right: 10,
      pieces: [
        {
          gt: 0,
          lte: 50,
          color: '#93CE07'
        },
        {
          gt: 50,
          lte: 100,
          color: '#FBDB0F'
        },
        {
          gt: 100,
          lte: 150,
          color: '#FC7D02'
        },
        {
          gt: 150,
          lte: 200,
          color: '#FD0100'
        },
        {
          gt: 200,
          lte: 10000,
          color: '#AA069F'
        },
        {
          gt: 10000,
          color: '#AC3B2A'
        }
      ],
      outOfRange: {
        color: '#999'
      }
    },
    series: {
      name: '实时计数率',
      type: 'line',
      data: data,
      markLine: {
        silent: true,
        lineStyle: {
          color: '#333'
        },
        data: [
          {
            yAxis: 50
          },
          {
            yAxis: 100
          },
          {
            yAxis: 150
          },
          {
            yAxis: 200
          },
          {
            yAxis: 10000
          }
        ]
      }
    },
    animation: false
  }
  const ADCPulse = {
    xAxis: {
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true
      }
    ]
  }

  switch (type){
    case 'ADCPulse':
      return ADCPulse
    case 'CountRate':
      return CountRate
    default :
      return Empty
  }
}

option.value = EchartsOption(data.value,'CountRate')

let updateEchartsFlag = false
const updateEcharts = ()=>{
  if (!updateEchartsFlag) {
    updateEchartsFlag = true
    watch(CupBoxID, (_now, _pre) => {
      useCounterSQLStore().CupBoxCount.forEach((_obj) => {
        if (_obj.ReadStatus == true) {
          _obj.CountBuff.splice(0, _obj.CountBuff.length)
          _obj.ReadStatus = false
        }
      })
      if (_now != '') {
        readCounterData(useCounterSQLStore().CupBoxCount.findIndex((item) => item.CupBoxID == CupBoxID.value))
        option.value = EchartsOption(useCounterSQLStore().CupBoxCount[useCounterSQLStore().CupBoxCount.findIndex((item) => item.CupBoxID == CupBoxID.value)].CountBuff, 'CountRate')
        watch(() => useCounterSQLStore().CupBoxCount[useCounterSQLStore().CupBoxCount.findIndex((item) => item.CupBoxID == CupBoxID.value)].CountBuff, () => {
          option.value = EchartsOption(useCounterSQLStore().CupBoxCount[useCounterSQLStore().CupBoxCount.findIndex((item) => item.CupBoxID == CupBoxID.value)].CountBuff, 'CountRate')
        })
      }
      updateEchartsFlag = false
    }, { once: true })
  }
}

</script>

<style scoped>

</style>
