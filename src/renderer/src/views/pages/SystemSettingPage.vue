<template>
  <v-card style="padding: 20px" height="1000px">
    <v-expansion-panels variant="accordion">
      <v-expansion-panel v-for="(value, key) in useSystemSettingStore().SystemSetting" :key="key" :title="value['title']['title'] as unknown as string">
        <template v-slot:text>
          <v-card elevation="0" >
            <v-card-text>
              <v-card color="miniBG" elevation="0">
                <v-row no-gutters>
                  <v-col
                    v-for="(subValue, subKey) in value"
                    :key="subKey"
                    cols="12">
                    <div v-if="subValue['type']==='Router_Array'" class="d-flex py-3 " style="min-height: 60px">
                      <v-expansion-panels>
                        <v-expansion-panel bg-color="miniBG" style="min-height: 60px" elevation="0">
                          <template v-slot:title class="text-h7">
                            {{ subKey }}
                          </template>
                          <template v-slot:text>
                            <v-row >
                              <v-col cols="3">
                                <div class="m-4">
                                  <p>管理员可访问</p>
                                  <v-select
                                    v-model="useSystemSettingStore().Router_Array_Setting.root"
                                    :items="useSystemSettingStore().Router_Array.all"
                                    variant="outlined"
                                    return-object
                                    single-line
                                    multiple>
                                    <template v-slot:selection="{ item, index }">
                                      <v-chip v-if="index < 3">
                                        <span>{{ item.title }}</span>
                                      </v-chip>
                                      <span
                                        v-if="index === 3"
                                        class="text-grey text-caption align-self-center">
                                        (+{{ useSystemSettingStore().Router_Array_Setting.root.length - 3 }} others)
                                      </span>
                                    </template>
                                  </v-select>
                                </div>
                              </v-col>
                              <v-col cols="3">
                                <div class="m-4">
                                  <p>普通用户可访问</p>
                                  <v-select
                                    v-model="useSystemSettingStore().Router_Array_Setting.normal"
                                    :items="useSystemSettingStore().Router_Array.all"
                                    variant="outlined"
                                    return-object
                                    single-line
                                    multiple>
                                    <template v-slot:selection="{ item, index }">
                                      <v-chip v-if="index < 3">
                                        <span>{{ item.title }}</span>
                                      </v-chip>
                                      <span
                                        v-if="index === 3"
                                        class="text-grey text-caption align-self-center">
                                        (+{{ useSystemSettingStore().Router_Array_Setting.normal.length - 3 }} others)
                                      </span>
                                    </template>
                                  </v-select>
                                </div>
                              </v-col>
                              <v-col cols="3">
                                <div class="m-4">
                                  <p>访客可访问</p>
                                  <v-select
                                    v-model="useSystemSettingStore().Router_Array_Setting.guest"
                                    :items="useSystemSettingStore().Router_Array.all"
                                    variant="outlined"
                                    return-object
                                    single-line
                                    multiple>
                                    <template v-slot:selection="{ item, index }">
                                      <v-chip v-if="index < 3">
                                        <span>{{ item.title }}</span>
                                      </v-chip>
                                      <span
                                        v-if="index === 3"
                                        class="text-grey text-caption align-self-center">
                                        (+{{ useSystemSettingStore().Router_Array_Setting.guest.length - 3 }} others)
                                      </span>
                                    </template>
                                  </v-select>
                                </div>
                              </v-col>
                            </v-row>
                          </template>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                    <div v-else-if="subValue['type']==='SQLSetting'" class="d-flex py-3 " style="min-height: 60px">
                      <v-expansion-panels>
                        <v-expansion-panel bg-color="miniBG" style="min-height: 60px" elevation="0">
                          <template v-slot:title class="text-h7">
                            {{ subKey }}
                          </template>
                          <template v-slot:text>
                            <v-row>
                              <v-col cols="3">
                                <v-text-field
                                  v-model="useSystemSettingStore().MySQL.INIT_SQL.host"
                                  @change="useSystemSettingStore().updateSQLText('host', $event)"
                                  hide-details="auto"
                                  label="HOST"
                                  :disabled="useSystemSettingStore().SystemSetting['数据库设置']['使用本地数据库']['value']"
                                  variant="outlined"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="3">
                                <v-text-field
                                  v-model="useSystemSettingStore().MySQL.INIT_SQL.port"
                                  @change="useSystemSettingStore().updateSQLText('port', $event)"
                                  hide-details="auto"
                                  label="HOST"
                                  :disabled="useSystemSettingStore().SystemSetting['数据库设置']['使用本地数据库']['value']"
                                  variant="outlined"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="3">
                                <v-text-field
                                  v-model="useSystemSettingStore().MySQL.INIT_SQL.user"
                                  @change="useSystemSettingStore().updateSQLText('user', $event)"
                                  hide-details="auto"
                                  label="USER"
                                  disabled
                                  variant="outlined"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="3">
                                <v-text-field
                                  v-model="useSystemSettingStore().MySQL.INIT_SQL.password"
                                  @change="useSystemSettingStore().updateSQLText('password', $event)"
                                  hide-details="auto"
                                  label="PASSWORD"
                                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                  :type="visible ? 'text' : 'password'"
                                  :disabled="!useSystemSettingStore().SystemSetting['数据库设置']['使用本地数据库']['value']"
                                  variant="outlined"
                                  @click:append-inner="visible = !visible"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </template>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                    <div v-else-if="subKey as unknown as string =='使用本地数据库'" class="d-flex py-3 justify-space-between" style="height: 60px">
                      <v-list-item density="compact" class="text-h7">
                        <v-list-item-title >
                          {{ subKey }}
                        </v-list-item-title>
                      </v-list-item>

                      <v-list-item v-if="subValue['type']==='switch'" density="compact">
                        <v-switch
                          :model-value="subValue['value']"
                          color="green"
                          inset
                          @change="useLocalHost(key, subKey,$event)"
                          hide-details
                        ></v-switch>
                      </v-list-item>
                    </div>
                    <div v-else-if="subValue['type']!='title'" class="d-flex py-3 justify-space-between" style="height: 60px">
                      <v-list-item density="compact" class="text-h7">
                        <v-list-item-title >
                          {{ subKey }} {{subValue['tips']==''?subValue['tips']:`(`+subValue['tips']+`)`}}
                        </v-list-item-title>
                      </v-list-item>

                      <v-list-item v-if="subValue['type']==='switch'" density="compact">
                        <v-switch
                          :model-value="subValue['value']"
                          color="green"
                          inset
                          @change="useSystemSettingStore().updateSwitch(key, subKey, $event)"
                          hide-details
                        ></v-switch>
                      </v-list-item>
                      <v-list-item v-if="subValue['type']==='select'" density="compact">
                        <v-select
                          style="width: 100px;text-align:right;"
                          :model-value="subValue['value']"
                          :items="subValue['option']"
                          variant="outlined"
                          @update:model-value="useSystemSettingStore().updateSelect(key, subKey, $event)"
                        ></v-select>
                      </v-list-item>
                      <v-list-item v-if="subValue['type']==='text'" density="compact">
                        <v-text-field
                          style="width: 100px;text-align:right;"
                          :model-value="subValue['value']"
                          hide-details="auto"
                          variant="outlined"
                          @change="useSystemSettingStore().updateText(key, subKey, $event)"
                        ></v-text-field>
                      </v-list-item>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card-text>
          </v-card>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-btn :loading="SaveLoading" @click="SaveSetting()">保存设置</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { useSystemSettingStore } from '../../store/useSystemSettingStore'

const SaveLoading = ref(false)
const visible = ref(false)

function SaveSetting(){
  SaveLoading.value = true
  const Callback = useSystemSettingStore().writeSysSetting()
  Callback.then((resolve)=>{
    if(resolve){
      SaveLoading.value = false
    }else {
      SaveLoading.value = false
    }
  })
}

const useLocalHost = (key, subKey,$event) => {
  useSystemSettingStore().MySQL.INIT_SQL.host = $event.target.checked ? 'localhost' : useSystemSettingStore().MySQL.SQL_Backup.host
  useSystemSettingStore().MySQL.INIT_SQL.port = $event.target.checked ? 3306 : useSystemSettingStore().MySQL.SQL_Backup.port
  useSystemSettingStore().MySQL.INIT_SQL.user  = $event.target.checked ? useSystemSettingStore().MySQL.SQL_Backup.user : 'admin'
  useSystemSettingStore().MySQL.INIT_SQL.password  = $event.target.checked ? useSystemSettingStore().MySQL.SQL_Backup.password : 'GT1PTB14416G'
  useSystemSettingStore().MySQL.SQL.host = $event.target.checked ? 'localhost' : useSystemSettingStore().MySQL.SQL_Backup.host
  useSystemSettingStore().MySQL.SQL.port = $event.target.checked ? 3306 : useSystemSettingStore().MySQL.SQL_Backup.port
  useSystemSettingStore().MySQL.SQL.user = $event.target.checked ? useSystemSettingStore().MySQL.SQL_Backup.user : 'admin'
  useSystemSettingStore().MySQL.SQL.password = $event.target.checked ? useSystemSettingStore().MySQL.SQL_Backup.password : 'GT1PTB14416G'
  useSystemSettingStore().updateSwitch(key, subKey, $event)
}
</script>

<style scoped></style>
