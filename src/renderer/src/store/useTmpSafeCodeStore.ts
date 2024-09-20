// Utilities
import { defineStore } from 'pinia'
import { SQLCallback, SQLJson } from '../type'
import { ElMessageBox } from 'element-plus'

const path = await window.api.getPath()
const PoolOptions: SQLJson = await window.api.readJSON(path + '/plugins/SQLSetting.json')
const SQLPool = await require('mysql2/promise').createPool(PoolOptions.SQL)

export const useTmpSafeCodeStore = defineStore('TmpSafeCode', {
  state: () => ({
    SafeClick:0,
    SafeCodeDialog:false,
    SafeAuthority:false
  }),
  actions: {
    TmpSafeClick(){
      if(this.SafeAuthority){
        this.SafeAuthority = false
      }else{
        this.SafeClick++
        if(this.SafeClick >=5 ){
          this.SafeCodeDialog = true
          this.SafeClick = 0
        }
      }
    },
    CodeCheck(tmp_safe_code:string){
      return SQLPool.execute('SELECT IF(COUNT(*) > 0 AND SUM(tmp_safe_code = ?), TRUE, FALSE) AS result FROM system_info', [tmp_safe_code]) as Promise<[SQLCallback, any]>
    },
    ChangeCode(){ //该函数目前没有返回值，原代码可返回SQLPool发送数据结果
      const Notification = ()=>{
        ElMessageBox.confirm(
          '是否变更临时安全码？',
          '警告',
          {
            confirmButtonText: '变更',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            const code = this.GetCode()
            SQLPool.execute('update system_info set tmp_safe_code = ?', [code]) as Promise<[SQLCallback, any]>
            ElMessageBox.alert('新的临时安全码为 ' + code + ' ,请妥善保存！', '新的临时安全码', {
              confirmButtonText: '确认',
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '未变更临时安全码',
            })
          })
      }

      Notification()

    },
    GetCode(){
      const num = ['1','2','3','4','5','6','7','8','9']
      const ENGLISH = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const code:string[] = []
      for (let i = 0; i < 12; i++) {
        const x = (Math.random()<=(num.length/(num.length+ENGLISH.length))?num[Math.floor(Math.random()*num.length)]:ENGLISH[Math.floor(Math.random()*ENGLISH.length)])
        code.push(x)
      }
      return code.join('')
    }
  },
})
