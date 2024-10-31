// Utilities
import { defineStore } from 'pinia'
import moment from 'moment/moment'
// import { SQLCallback, SQLJson } from '../type'
//
// const path = await window.api.getPath()
// const PoolOptions: SQLJson = await window.api.readJSON(path + '/plugins/SQLSetting.json')
// const SQLPool = await require('mysql2/promise').createPool(PoolOptions.SQL)
const fs = require("fs")
const util = require("util")
const path = require('path')
const readline = require('readline')

export const useCounterSQLStore = defineStore('CounterSQL', {
  state: () => ({
    availableChannel:[] as any[],
    CupBoxCount:[] as {CupBoxID:string, CountBuff:(any)[], WriteCount:number, ReadCount:number, ReadStatus:boolean}[]
  }),
  actions: {

  },
})

const writeFile = util.promisify(fs.writeFile)
const folderPath = path.join('', 'CounterData')
export async function createFolder() {  //创建存储数据的文件夹
  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
  } catch (err) {
    console.error('Error founding folder for counter data:', err);
  }
}
export async function pushCounterData(counterSqlId:number, momentUnix:number, counterData:number) {
  try {
    const dataArrayToString = JSON.stringify([momentUnix, counterData])  //将传入数据转化为字符串以便于写入.log文件中
    const filepath = './CounterData/Data' + useCounterSQLStore().CupBoxCount[counterSqlId].CupBoxID + '_' + Math.floor(useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount / 50) + '.log'  //生成文件名：Data+箱号+下划线+数据包序号（0-24）.log
    if (Number.isInteger((useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount / 50))) { await writeFile(filepath, '', 'utf8') }  //在上个包中填满50条数据后，创建或覆盖下一个包以准备接受数据
    await fs.promises.appendFile(filepath, dataArrayToString + '\n')  //传入数据
    useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount++  //循环计数变量CycleCount自增
    if (useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount == 1250) {useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount = 0}  //计满1250条数据后循环计数变量清零，从0号log文件开始重新计数
    if (useCounterSQLStore().CupBoxCount[counterSqlId].ReadStatus == true) {
      if (useCounterSQLStore().CupBoxCount[counterSqlId].CountBuff.length > 1250) {
        useCounterSQLStore().CupBoxCount[counterSqlId].CountBuff.splice(0,1)
      }
      useCounterSQLStore().CupBoxCount[counterSqlId].CountBuff.push([moment.unix(momentUnix).format('YYYY-MM-DD HH:mm:ss'), counterData])
    }
  } catch (err) {
    console.error('Error pushing counter data to log:', err)
  }
}
export async function readCounterData(counterSqlId:number) {
  try {
    await fs.promises.stat('./CounterData/Data' + useCounterSQLStore().CupBoxCount[counterSqlId].CupBoxID + '_' + '24' + '.log')
    useCounterSQLStore().CupBoxCount[counterSqlId].ReadCount = (Math.floor(useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount / 50) + 1) * 50
    if (useCounterSQLStore().CupBoxCount[counterSqlId].ReadCount >= 1250) {
      useCounterSQLStore().CupBoxCount[counterSqlId].ReadCount = 0
    }
    for (let cnt = Math.floor(useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount / 50) + 1; cnt < Math.floor(useCounterSQLStore().CupBoxCount[counterSqlId].WriteCount / 50) + 26; cnt++) {
      const filepath = './CounterData/Data' + useCounterSQLStore().CupBoxCount[counterSqlId].CupBoxID + '_' + (cnt % 25) + '.log'
      const readStream = fs.createReadStream(filepath)
      await readLine(readStream, counterSqlId)
    }
    useCounterSQLStore().CupBoxCount[counterSqlId].ReadStatus = true
  } catch (err:any) {
    if (err.code === 'ENOENT') { //未创建24个文件
      setTimeout(async () => {
        for (let cnt = 0; cnt < 25; cnt++) {
          const readStream = fs.createReadStream('./CounterData/Data' + useCounterSQLStore().CupBoxCount[counterSqlId].CupBoxID + '_' + (Math.floor(useCounterSQLStore().CupBoxCount[counterSqlId].ReadCount / 50) + cnt) + '.log')
          await readLine(readStream, counterSqlId)
        }
      },1000)
      useCounterSQLStore().CupBoxCount[counterSqlId].ReadStatus = true
      console.log(useCounterSQLStore().CupBoxCount[counterSqlId].ReadStatus)
    } else {
      console.error('Error reading counter data:', err)
   }
  }
}
async function readLine(readStream:any,counterSqlId:number) {
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  })
  rl.on('line', (line) => {
    useCounterSQLStore().CupBoxCount[counterSqlId].CountBuff.push([moment.unix(JSON.parse(line)[0]).format('YYYY-MM-DD HH:mm:ss'), JSON.parse(line)[1]])
  })
  return new Promise((resolve)=>{
    rl.on('close', () => {
      resolve(undefined)
    })
  })
}
