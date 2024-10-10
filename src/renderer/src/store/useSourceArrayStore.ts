// Utilities
import { defineStore } from 'pinia'
import { SourceBind, SourcesArray, SQLJson } from '../type'
import SourceArrayStoreSQL from '../sql/SourceArrayStore.sql?raw'

const path = await window.api.getPath()
const PoolOptions:SQLJson = await window.api.readJSON(path + '/plugins/SQLSetting.json')
const SQLPool = await require('mysql2/promise').createPool(PoolOptions.SQL)

export const useSourceArrayStore = defineStore('SourceArray', {
  state: () => ({
    SourceArray: [] as SourcesArray[],
    GetSourceArray:[]  as SourcesArray[],
  }),
  actions: {
    async UpdateSourceArray() {
      try {
        const SourceArray = await SQLPool.execute(SourceArrayStoreSQL as string, [])
        this.SourceArray = SourceArray[0] as SourcesArray[]
      } catch (error) {
        console.error(error)
      }
    },
    getBind(SSID:any){
      const bindEmpty =   {
        device_id:"未绑定",
        wiz_ip:"未绑定",
        wiz_port:"未绑定",
        cupbox_id:"未绑定"}

      return new Promise<SourceBind>((resolve, _reject) => {
        SQLPool.execute("select dl.*,cl.* from device_list dl join cupboard_list cl on dl.device_id=cl.device_id where dl.SSID=?",[SSID])
          .then((res:any)=>{
            const SourceBind = res[0][0] as unknown as SourceBind == undefined?{}:res[0][0] as unknown as SourceBind
            const allGet = Object.keys(SourceBind)
            allGet.forEach((key:string) => {
              bindEmpty[key] = SourceBind[key]
            })
            resolve (bindEmpty)
          })
      })
    },
    GetSourceArray(_SSID:string){
    }
  },
})
