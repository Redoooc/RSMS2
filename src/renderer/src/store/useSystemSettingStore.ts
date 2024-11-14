// Utilities
import { defineStore } from 'pinia'
import { MySQLSetting, Router_Array } from '../type'

const path = await window.api.getPath()
const SystemSetting = await window.api.readJSON(path + '/plugins/SystemSetting.json')
const Router_Array:Router_Array = await window.api.readJSON(path + '/plugins/RouterArray.json')
const Router_Array_Setting:Router_Array = await window.api.readJSON(path + '/plugins/RouterArray.json')
const MySQL:MySQLSetting = await window.api.readJSON(path + '/plugins/SQLSetting.json')

export const useSystemSettingStore = defineStore('SystemSetting', {
  state: () => ({
    ShowLeftDrawer:true,
    SystemSetting:SystemSetting,
    Router_Array:Router_Array,
    Router_Array_Setting:Router_Array_Setting,
    MySQL:MySQL,
  }),
  actions: {
    async loadSystemSetting(){
      this.SystemSetting = await window.api.readJSON(path + '/plugins/SystemSetting.json')
      this.Router_Array = await window.api.readJSON(path + '/plugins/RouterArray.json')
      this.Router_Array_Setting = await window.api.readJSON(path + '/plugins/RouterArray.json')
      this.MySQL = await window.api.readJSON(path + '/plugins/SQLSetting.json')
    },
    async writeSysSetting(){
      return new Promise((resolve, _reject) => {
        this.Router_Array_Setting.root.sort((a,b)=>{return a.index-b.index})
        this.Router_Array_Setting.normal.sort((a,b)=>{return a.index-b.index})
        this.Router_Array_Setting.guest.sort((a,b)=>{return a.index-b.index})
        setTimeout(async()=>{
          await window.api.writeJSON(path + '/plugins/SystemSetting.json',JSON.stringify(this.SystemSetting, null, 1))
          await window.api.writeJSON(path + '/plugins/RouterArray.json',JSON.stringify(this.Router_Array_Setting, null, 1))
          await window.api.writeJSON(path + '/plugins/SQLSetting.json',JSON.stringify(this.MySQL, null, 1))
          setTimeout(()=>{
            this.loadSystemSetting()
            resolve(true)
          },500)
        },500)
      })

    },
    updateSwitch(key, subKey, event) {
      this.SystemSetting[key][subKey]['value'] = event.target.checked
    },
    updateSelect(key, subKey, event) {
      this.SystemSetting[key][subKey]['value'] = event
    },
    updateText(key, subKey,event) {
      this.SystemSetting[key][subKey]['value'] = event.target.value
    },
    updateNumber(key, subKey,event) {
      this.SystemSetting[key][subKey]['value'] = parseInt(event.target.value)
    },
    updateSQLText(key, event) {
      this.MySQL.SQL[key] = event.target.value
    }
  },
})
