// Utilities
import { defineStore } from 'pinia'
import { useSystemSettingStore } from './useSystemSettingStore'
//Plugins

const SchedulerMax:number = useSystemSettingStore().SystemSetting['源柜通讯设置']['调度器最大并行队列数'].value
declare interface OPTION {
  delay?: number,
  id?: number,
  seize?:{
    enabled:boolean,
  }
}
const CheckObject = (objectA: object, objectB: object, filter: string[]): boolean => {
  if(objectA==null||objectB==null) return false
  let Correct = 1
  const keys = Object.entries(objectA)
  for (let i = 0; i < keys.length; i++) {
    if (filter.includes(keys[i][0])) {
      Correct *= 1
    } else {
      if (typeof objectB[keys[i][0]] == typeof keys[i][1] && objectB[keys[i][0]] == keys[i][1]) {
        Correct *= 1
      } else {
        Correct *= 0
      }
    }
  }
  return Correct == 1
}
const monitorFunction = async <T>(func: (...args: any[]) => Promise<T>, timeout: number, ...args: any[]): Promise<T|string|null> => {
  let timeoutId: NodeJS.Timeout;

  timeout = func.name == 'ReSetTimeFunction'?useSystemSettingStore().SystemSetting['源柜通讯设置']['单次校时指令超时时间'].value:timeout //ReSet the Board Time need more time

  const timeoutPromise = new Promise<T|string|null>((resolve) => {
    timeoutId = setTimeout(() => {
      resolve("MonitorTimeOut");
    }, timeout)
  });

  return Promise.race([
    func(...args),
    timeoutPromise
  ])
    .then((result) => {
    clearTimeout(timeoutId);
    return result;
  })
}

export const useSchedulerStore = defineStore('Scheduler', {
  state: () => ({
    monitorDrawer:false,
    max: SchedulerMax,
    count: 0 as number,
    queue0: Array.from({ length: SchedulerMax }, () => []) as any[][],
    queue0count: Array.from({ length: SchedulerMax }, () => 0) as number[],
    queue0status: Array.from({ length: SchedulerMax }, () => false) as boolean[],
    queue0recorder: Array.from({ length: SchedulerMax }, () => 0) as number[],
    queue0cache: Array.from({ length: SchedulerMax }, () => null) as any[],
    queue0enable: Array.from({ length: SchedulerMax }, () => false) as boolean[],
    queue0same: Array.from({ length: SchedulerMax }, () => []) as any[][],
    loopFlagForStart: false as boolean
  }),
  actions: {
    async add(FUNCTION:Function, Value: any, Option: OPTION):Promise<number[]|string|null> {
      //分配器
      const executeID = this.queue0count.findIndex((count) => count == Math.min(...this.queue0count))
      if (executeID == -1) return "executeID ERROR"
      this.queue0count[executeID]++
      //复用器
      this.queue0enable[executeID]=true
      //阻塞器
      await new Promise(resolve => {
        Option.hasOwnProperty('seize') && Option.seize!.enabled ? this.queue0[executeID].splice(0,0,{ resolve: resolve, option: Option }):this.queue0[executeID].push({ resolve: resolve, option: Option })
      })
      // avoid two tasks had same ip are sent by different channel of scheduler
      if ((this.queue0same.findIndex((ipArray) => (ipArray.findIndex((ip) => ip == Value.ip) != -1))) != -1) {
        return null
      } else {
        this.queue0same[executeID].push(Value.ip)
      }

      this.queue0status[executeID] = true   //注册状态位
      //延时器
      await new Promise(resolve => setTimeout(resolve, Option.hasOwnProperty('delay')?Option.delay:0))
      //执行器
      return await this.executeTask(FUNCTION, Value, executeID, Option)
    },
    async start() {
      while (this.loopFlagForStart) {
        if (useSchedulerStore().queue0enable.findIndex(enable=>enable)!=-1) {
          if (Math.max(...this.queue0count)) {
            for (let executeID = 0; executeID < 12; executeID++) {
              if (this.queue0enable[executeID]) (!this.queue0status[executeID]) && this.queue0[executeID].length && (this.queue0[executeID].shift().resolve() || this.queue0count[executeID]--)
              if (!this.queue0status[executeID] && this.queue0count[executeID]==0){this.queue0enable[executeID]=false}
            }
          }
        }
        await new Promise(resolve => setTimeout(resolve, useSystemSettingStore().SystemSetting['源柜通讯设置']['调度器最短扫描时间'].value))
      }
      // if (Math.max(...this.queue0count)) {
      //   for (let executeID = 0; executeID < 12; executeID++) {
      //     if (this.queue0enable[executeID]) (!this.queue0status[executeID]) && this.queue0[executeID].length && (this.queue0[executeID].shift().resolve() || this.queue0count[executeID]--)
      //   }
      // }
    },
    async executeTask(FUNCTION, Value: any, executeID:number, _Option: OPTION) {
      const cache0index = this.queue0cache.findIndex((cache:any) =>{return CheckObject(cache,Value,[])})    //查询缓存器
      this.queue0cache[executeID] = cache0index==-1?Value:null    //注册缓存器

      let res:any = null
      try{
        res = cache0index==-1 ? ( await monitorFunction(FUNCTION,useSystemSettingStore().SystemSetting['源柜通讯设置']['单次调度最大超时时间'].value,Value,executeID) ):( "CACHE IN " + cache0index as unknown as number )    //是否执行缓存跳过
      }catch (error){
        console.log(error)
      }

      this.queue0cache[executeID] = null
      this.queue0status[executeID] = false
      this.queue0same[executeID].splice(0,1)

      this.queue0recorder[executeID]++    //注册记录器

      // if(this.queue0enable[executeID])(!this.queue0status[executeID]) && this.queue0[executeID].length && (this.queue0[executeID].shift().resolve()||this.queue0count[executeID]--)


      return res
    }

  }
})
