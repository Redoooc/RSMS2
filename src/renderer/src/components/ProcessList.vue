<template>
  <v-card style="margin: 10px; padding: 10px;">
    <v-data-iterator :items="apply" :items-per-page=50 :search="search">
      <template v-slot:header>
        <v-toolbar class="px-2">
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details
            placeholder="搜索"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px;"
            variant="solo"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items }">
        <el-scrollbar height="860px" style="padding-left: 50px;" >
          <v-container class="pa-2" fluid>
            <v-row dense >
              <v-col
                v-for="apply_item in items"
                :key="apply_item.raw.apply_id"
                cols="2"
              >
                <ProcessCard :apply_item="apply_item.raw"></ProcessCard>
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
import { ApplyArray } from '../type'
import ProcessCard from './ProcessCard.vue'

let search = ref('')

defineProps<{
  ShowPerPage: number,
  apply: ApplyArray[]
}>()
</script>

<style scoped>
</style>
