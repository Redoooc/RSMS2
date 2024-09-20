<template>
  <div class="text-center">
    <v-dialog v-model="useSourceListStatusStore().OpenApplySheet" width="800" inset >
      <form @submit.prevent="submit">
        <div>
          <v-card
            class="mx-auto pa-12 pb-8 text-center"
            elevation="8"
            width="800"
            height="1000"
            rounded="lg"
          >
            <v-card-text>
              <v-btn variant="text" @click="useSourceListStatusStore().OpenApplySheet = !useSourceListStatusStore().OpenApplySheet"> close </v-btn>
              <div>你正在填写{{useUserDataStore().apply_id}}号申请,预约{{useSourceListStatusStore().ChooseSource.SSID}}号源。</div>
            </v-card-text>
            <v-container>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="SSID.value.value"
                    :error-messages="SSID.errorMessage.value"
                    density="compact"
                    label="SSID"
                    :placeholder="'Enter your SSID'"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="useSourceListStatusStore().ChooseSource.nuclide"
                    density="compact"
                    label="源"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="useSourceListStatusStore().ChooseSource.nuclide_quality"
                    density="compact"
                    label="质量数"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2">
                  <v-text-field
                    v-model="useUserDataStore().apply_id"
                    density="compact"
                    label="申请编号"
                    :placeholder="'Enter your user'"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="name.value.value"
                    :error-messages="name.errorMessage.value"
                    density="compact"
                    label="用户"
                    :placeholder="'Enter your name'"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="user.value.value"
                    :error-messages="user.errorMessage.value"
                    density="compact"
                    label="账号"
                    :placeholder="'Enter your user'"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="reason.value.value as string"
                    :items="reason_item"
                    :error-messages="reason.errorMessage.value"
                    label="申请原因"
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="first_time.value.value"
                    :error-messages="first_time.errorMessage.value"
                    density="compact"
                    label="当前申请时间"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="last_time.value.value"
                    :error-messages="last_time.errorMessage.value"
                    density="compact"
                    label="预计归还时间"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-card-text>
                    <span class="text-h2 font-weight-light" v-text="time"></span>
                    <span class="subheading font-weight-light me-1">Hours</span>
                    <v-fade-transition>
                      <v-avatar
                        :color="color"
                        :style="{ animationDuration: animationDuration }"
                        class="mb-1 v-avatar--metronome"
                        size="12"
                      ></v-avatar>
                    </v-fade-transition>
                    <v-slider
                      v-model="time"
                      :color="color"
                      track-color="grey"
                      min="1"
                      max="24"
                      :step="1"
                      hint="预计使用时间"
                      persistent-hint
                    >
                    </v-slider>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-container>
            <v-btn
              type="submit"
              block
              :loading="loading"
              class="mb-1"
              color="blue"
              size="large"
              variant="tonal"
              :disabled="useSourceListStatusStore().ChooseSource.SourceStatus!='READY'"
            >
              提交
            </v-btn>
            <v-btn
              block
              class="mb-8"
              color="green"
              size="large"
              variant="tonal"
              @click="handleReset();UpdateData()"
            >
              清空
            </v-btn>

          </v-card>
        </div>
      </form>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {useSourceListStatusStore} from '../store/useSourceListStatusStore'
import {ref} from "vue";
import {useField, useForm} from 'vee-validate'
import { useUserDataStore } from '../store/useUserDataStore'
import { useSourceArrayStore } from '../store/useSourceArrayStore'
const moment = require('moment')

const {handleSubmit, handleReset} = useForm({
  validationSchema: {
    user (value) {
      if (value?.length >= 1) return true

      return '账户信息获取失败'
    },
    name (value) {
      if (value?.length >= 1) return true

      return '账户信息获取失败'
    },
    reason (_value) {
      if (reason_item.value.includes(reason.value.value as string)) return true
      return '申请原因不能为空'
    },
  },
})

const time = ref(24);

const SSID = useField('SSID')
const user = useField('user')
const name = useField('name')
const first_time = useField('first_time')
const last_time = useField('last_time')
const reason = useField('reason')

useSourceListStatusStore().$subscribe((_args,state)=>{
  if(state.OpenApplySheet == true){
    handleReset()
    SSID.value.value = state.ChooseSource.SSID
    first_time.value.value = moment().format("YYYY-MM-DD HH:mm:ss")
    last_time.value.value = moment().add({h:time.value}).format("YYYY-MM-DD HH:mm:ss")
    user.value.value = useUserDataStore().UserData.user
    name.value.value = useUserDataStore().UserData.name
  }
})
watch(time, (_time, _prevtime) => {
  last_time.value.value = moment().add({h:_time}).format("YYYY-MM-DD HH:mm:ss")
})

const color = computed(() => {
  if (time.value < 5) return 'indigo'
  if (time.value < 10) return 'teal'
  if (time.value < 15) return 'green'
  if (time.value < 20) return 'orange'
  return 'red'
})
const Message = () => {
  ElMessage({
    message: "预约成功，您的预约编号为No." + useUserDataStore().apply_id + ";请妥善保管。",
    type: 'success',
  })
}
const animationDuration = computed(() => `${60 / time.value}s`)
const reason_item = ref(['实验使用','源库迁移','教学使用','其他'])
function UpdateData(){
  handleReset()
  SSID.value.value = useSourceListStatusStore().ChooseSource.SSID
  first_time.value.value = moment().format("YYYY-MM-DD HH:mm:ss")
  last_time.value.value = moment().add({h:time.value}).format("YYYY-MM-DD HH:mm:ss")
  user.value.value = useUserDataStore().UserData.user
  name.value.value = useUserDataStore().UserData.name
}

let loading = ref(false)

const submit = handleSubmit(values => {
  useUserDataStore().UserApply = {
    SSID: values.SSID,
    user: values.user,
    first_time: values.first_time,
    last_time: values.last_time,
    reason: values.reason,
    apply_status: 'process',
    event_status: 'normal',
    user_status:'normal'
  }
  useUserDataStore().AddApply()
  loading.value = true
  setTimeout(()=>{
    useSourceArrayStore().UpdateSourceArray()
    setTimeout(()=>{
      if(useSourceArrayStore().SourceArray.find((_source)=>{
        return _source.SSID == useSourceListStatusStore().ChooseSource.SSID&&_source.SourceStatus == 'PROCESS';
      })!=undefined){
        loading.value = false
        useSourceListStatusStore().OpenApplySheet = false
        Message()
      }
    },500)
  },300)
})
</script>

<style scoped>
@keyframes metronome-example {
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}

.v-avatar--metronome {
  animation-name: metronome-example;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
</style>
