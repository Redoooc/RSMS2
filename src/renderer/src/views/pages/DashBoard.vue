<template>
  <v-row column-gap="10px">
    <v-col cols="auto">
      <CalendarCard :_-apply-list="Apply" :_-source-array="Source" ></CalendarCard>
    </v-col>
    <v-col cols="auto">
      <TimelineCard :_-apply-list="Apply" :_-source-array="Source" ></TimelineCard>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import { useUserProcessStore } from '../../store/useUserProcessStore'
import { Ref, ref } from 'vue'
import CalendarCard from '../../components/CalendarTimeline/CalendarCard.vue'
import { useSourceArrayStore } from '../../store/useSourceArrayStore'

const Apply:Ref<any[]> = ref([])
const Source:Ref<any[]> = ref([])

useUserProcessStore().$subscribe((_arg,state)=>{
  Apply.value = state.ApplyList
})

useSourceArrayStore().$subscribe((_arg,state)=>{
  Source.value = state.SourceArray
})

onMounted(async () => {
  await useUserProcessStore().GetApply()
  await useSourceArrayStore().UpdateSourceArray()
})
</script>

<style scoped>

</style>
