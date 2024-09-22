<template>
  <CalendarCard :_-apply-list="Apply" :_-source-array="Source" ></CalendarCard>
</template>

<script setup lang="ts">

import { useUserProcessStore } from '../../store/useUserProcessStore'
import { Ref, ref } from 'vue'
import CalendarCard from '../../components/CalendarCard.vue'
import { useSourceArrayStore } from '../../store/useSourceArrayStore'

const Apply:Ref<any[]> = ref([])
const Source:Ref<any[]> = ref([])

useUserProcessStore().GetApply()
useUserProcessStore().$subscribe((_arg,state)=>{
  Apply.value = state.ApplyList
})

useSourceArrayStore().UpdateSourceArray()
useSourceArrayStore().$subscribe((_arg,state)=>{
  Source.value = state.SourceArray
})
</script>

<style scoped>

</style>
