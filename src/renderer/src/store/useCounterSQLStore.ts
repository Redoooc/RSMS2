// Utilities
import { defineStore } from 'pinia'
import moment from 'moment/moment'
import { useSystemSettingStore } from './useSystemSettingStore'
// import { SQLCallback, SQLJson } from '../type'
//
// const path = await window.api.getPath()
// const PoolOptions: SQLJson = await window.api.readJSON(path + '/plugins/SQLSetting.json')
// const SQLPool = await require('mysql2/promise').createPool(PoolOptions.SQL)
const fs = require("fs")
const util = require("util")
const path = require('path')
const readline = require('readline')
const writeFile = util.promisify(fs.writeFile)
const folderPath = path.join('', 'CounterData')
const MaxCountBeforeLoop = useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包个数'].value*useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包存储量'].value

export const useCounterSQLStore = defineStore('CounterSQL', {
  state: () => ({
    availableChannel:[] as any[],
    CupBoxCount:[] as {CupBoxID:string, CountBuff:(any)[], WriteCount:number, ReadStatus:boolean}[]
  }),
  actions: {
    async createFolder() {  //found the folder to save the CounterData
      try {
        await fs.promises.mkdir(folderPath, { recursive: true });
      } catch (err) {
        console.error('Error founding folder for counter data:', err);
      }
    },
    async pushCounterData(counterSqlId:number, momentUnix:number, counterData:number) {
      try {
        const dataArrayToString = JSON.stringify([momentUnix, counterData])
        const filepath = './CounterData/Data' + this.CupBoxCount[counterSqlId].CupBoxID + '_' + Math.floor(this.CupBoxCount[counterSqlId].WriteCount / useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包存储量'].value) + '.log'  //Generate file name: Data+box number+underline+packet number (0-24). log

        //After filling enough pieces of data in the previous package, create or overwrite the next package to prepare for receiving data. If the creation fails, the function will pop up
        if (Number.isInteger((this.CupBoxCount[counterSqlId].WriteCount / useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包存储量'].value))) {await writeFile(filepath, '', 'utf8')}

        //Add a new data to the end of the current packet
        await fs.promises.appendFile(filepath, dataArrayToString + '\n')
        this.CupBoxCount[counterSqlId].WriteCount++

        //loop in external memory files(log files)
        if (this.CupBoxCount[counterSqlId].WriteCount == MaxCountBeforeLoop) {this.CupBoxCount[counterSqlId].WriteCount = 0}

        //monitor page open and data have been loaded
        if (this.CupBoxCount[counterSqlId].ReadStatus == true) {
          //loop in internal memory(pinia)
          if (this.CupBoxCount[counterSqlId].CountBuff.length > MaxCountBeforeLoop) {
            this.CupBoxCount[counterSqlId].CountBuff.splice(0,1)
          }
          //directly push data to pinia
          this.CupBoxCount[counterSqlId].CountBuff.push([moment.unix(momentUnix).format('YYYY-MM-DD HH:mm:ss'), counterData])
        }
      } catch (err) {
        //if catch error, WriteCount will not increase
        console.error('Error pushing counter data to log:', err)
      }
    },
    async readCounterData(counterSqlId:number) {
      try {
        //Check whether the loop overwrite has started by checking the number of files
        await fs.promises.stat('./CounterData/Data' + this.CupBoxCount[counterSqlId].CupBoxID + '_' + String(useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包个数'].value-1) + '.log')

        //the loop overwrite has started
        const tempWriteCount = this.CupBoxCount[counterSqlId].WriteCount
        for (let cnt = Math.floor(tempWriteCount / useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包存储量'].value) + 1; cnt < (Math.floor(tempWriteCount / useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包存储量'].value) + useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包个数'].value + 1); cnt++) {
          const filepath = './CounterData/Data' + this.CupBoxCount[counterSqlId].CupBoxID + '_' + (cnt % useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包个数'].value) + '.log'
          const readStream = fs.createReadStream(filepath)
          await this.readLine(readStream, counterSqlId)
          if (cnt == Math.floor(tempWriteCount / useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包存储量'].value) + useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包个数'].value) {this.CupBoxCount[counterSqlId].ReadStatus = true}
        }
      } catch (err:any) {
        if (err.code === 'ENOENT') {
          //the loop overwrite hasn't started
          for (let cnt = 0; cnt < useSystemSettingStore().SystemSetting['探测器计数存储设置']['数据包个数'].value; cnt++) {
            const readStream = fs.createReadStream('./CounterData/Data' + this.CupBoxCount[counterSqlId].CupBoxID + '_' + cnt + '.log')
            if (await this.readLine(readStream, counterSqlId) == 'ENOENT') {
              this.CupBoxCount[counterSqlId].ReadStatus = true
              break
            }
          }
        } else {
          console.error('Error reading counter data:', err)
        }
      }
    },
    async readLine(readStream:any,counterSqlId:number) {
      const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
      })
      rl.on('line', (line) => {
        this.CupBoxCount[counterSqlId].CountBuff.push([moment.unix(JSON.parse(line)[0]).format('YYYY-MM-DD HH:mm:ss'), JSON.parse(line)[1]])
      })
      return new Promise((resolve)=>{
        rl.on('close', () => {
          resolve(undefined)
        })
        rl.on('error',(err)=>{
          if (err.code === 'ENOENT') {
            console.warn('ENOENT in readline:', err)
            resolve('ENOENT')
          }
          else {
            console.error('Error in readline:', err)
          }
        })
      })
    }
  },
})
