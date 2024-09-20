import { PoolOptions } from 'mysql2'

export declare interface SourcesArray {
  nuclide_index: number,
  nuclide: string,
  nuclide_id: number,
  nuclide_name: string,
  nuclide_quality: number,
  nuclide_rate: string,
  nuclide_type: string,
  nuclide_energy: number[][],
  SSID: string,
  cupbox_id: string,
  device_id: number,
  SourceStatus: 'READY' | 'OUT' | 'ALARM' | 'PROCESS' | 'PROCESS-PASS',
}

export declare interface DeviceArray {
  nuclide: string,
  nuclide_id: number,
  nuclide_name: string,
  nuclide_quality: number,
  SSID: string,
  SourceStatus: 'READY' | 'OUT' | 'ALARM' | 'PROCESS' | 'PROCESS-PASS'|'NONE',
  device_id:string,
  wiz_ip:string,
  wiz_port:string,
  cupbox_id:string,
}

export declare interface SourcesFilterArray {
  nuclide_index?: number,
  nuclide?: string,
  nuclide_name?: string,
  nuclide_quality?: number,
  nuclide_rate?: string,
  nuclide_type?: string,
  nuclide_energy?: number[][],
  SSID?: string,
  SourceStatus?: string,
}

export declare interface SourcesFilterBufferArray {
  nuclide_index: number[],
  nuclide: string[],
  nuclide_name: string[],
  nuclide_quality: number[],
  nuclide_rate: string[],
  nuclide_type: string[],
  SSID: string[],
  SourceStatus: string[],
}

export declare interface UserSource {
  user: string,
  authority: 'root' | 'normal' | 'guest',
  name: string,
  card: string,
  SSID: string,
  cupbox_id: string,
  nuclide: string,
  nuclide_id: string,
  nuclide_name: string,
  nuclide_quality: string,
  wiz_ip: string,
  wiz_port: string,
  device_id: string,
  SourceStatus: string,
}

export declare interface SourceBind {
  device_id:string,
  wiz_ip:string,
  wiz_port:string,
  cupbox_id:string,
}

export declare interface User {
  UserStatus:"Logout"|"Login",
  UserData:UserData
}

export declare interface UserData {
  user: string,
  authority: 'root' | 'normal' | 'guest',
  name: string,
  card: string,
  SSID: string,
  state: "normal"|"freeze"
}

export declare interface CupBoardArray {
  cupBoardIndex: string,
  cupBoxLeftArray: string[],
  cupBoxRightArray: string[]
}

export declare interface CupBoardCallback {
  Callback: string,
  OnLineCupBoard: string[]
}

export declare interface UserDataSourcesSource {
  SSID: string,
  cupbox_id: string,
  device_id: string,
  apply_id: string,
  nuclide: string,
  nuclide_id: string,
  nuclide_name: string,
  nuclide_quality: string,
  wiz_ip: string,
  wiz_port: string,
  SourceStatus: string,
}

export declare interface UserDataSources {
  CupBoard: string[],
  Sources: UserDataSourcesSource[]
}

export declare interface SQLJson {
  INIT_SQL: PoolOptions,
  SQL: PoolOptions,
}

export declare interface Source_List_Data {
  nuclide?: string,
  nuclide_id?: number,
  nuclide_name?: string,
  nuclide_index?: number,
  nuclide_quality?: number,
  nuclide_rate?: string,
  nuclide_type?: string,
  nuclide_energy?: number[][],
  Status?: 'READY' | 'OUT' | 'ALARM' | 'PROCESS' | 'PROCESS-PASS',
}

export declare interface Device_List_Data {
  device_id?: string,
  SSID?: string|number,
  wiz_ip?: string,
  wiz_port?: number,
}

export declare interface Cupboard_List_Data {
  cupbox_id: string,
  SSID: string,
}

export declare interface CupboardArray {
  cupbox_id: string,
  device_id: string,
}

export declare interface UserApply {
  SSID: string,
  user: string,
  first_time?: string,
  last_time?: string,
  process_time?: string,
  back_time?: string,
  reason?: string,
  apply_status?: 'process' | 'process-pass' | 'process-forbid',
  event_status?: 'wait' | 'out' | 'normal'|'back',
  user_status?: 'overdue' | 'normal',
}

export declare interface CountRate {
  CountRateStatus: boolean,
  TimeStamp: number;
  Count: number;
  Sample_Count_Total: number;
  CountRate: number;
}

export declare interface SocketInfo {
  Address: { hostname: string, port: number },
  ID: string,
  Result: string,
  ResultCMD: any
}

export declare interface ADCPulse {
  ADCPulseStatus: boolean,
  Index: number,
  Ch: number,
  Peak: number
}

export declare interface UserRegister {
  CardResult: boolean,
  UserResult: boolean,
  Card: string,
  User: string,
  name: string,
  password: string,
  authority: 'root' | 'normal' | 'guest',
  Result: number
}

export declare interface ApplyArray {
  apply_id: string,
  SSID: string,
  user: string,
  name: string,
  reason: string,
  apply_status: 'process' | 'process-pass' | 'process-forbid',
  event_status: 'wait' | 'out' | 'normal'|'back',
  user_status: 'overdue' | 'normal',
  first_time: string,
  last_time: string,
  process_time: string,
  out_time: string,
  back_time: string,
  nuclide?: string,
  nuclide_id?: number,
  nuclide_name?: string,
  nuclide_index?: number,
  nuclide_quality?: number,
  nuclide_rate?: string,
  nuclide_type?: string,
  nuclide_energy?: number[][],
  Status?: 'READY' | 'OUT' | 'ALARM' | 'PROCESS' | 'PROCESS-PASS',
}

export declare interface CupBoxSource {
  cupbox_id: string,
  SSID: string,
  device_id: string,
  wiz_ip:string,
  wiz_port:number,
  nuclide: string,
  nuclide_id: number,
  nuclide_index: number,
  nuclide_name: string,
  nuclide_quality: number,
  nuclide_rate: string,
  nuclide_type: string,
  nuclide_energy: number[][],
  SourceStatus: 'READY' | 'OUT' | 'ALARM' | 'PROCESS' | 'PROCESS-PASS',
}

export declare interface CupBoxUserInfo {
  cupbox_id: string,
  SSID: string,
  nuclide: string,
  nuclide_index: number,
  nuclide_name: string,
  nuclide_quality: number,
  nuclide_rate: string,
  nuclide_type: string,
  nuclide_energy: number[][],
  SourceStatus: 'READY' | 'OUT' | 'ALARM' | 'PROCESS' | 'PROCESS-PASS',
  apply_id: string,
  user: string,
  first_time?: string,
  last_time?: string,
  process_time?: string,
  back_time?: string,
  reason?: string,
  apply_status?: 'process' | 'process-pass' | 'process-forbid',
  event_status?: 'wait' | 'out' | 'normal'|'back',
  user_status?: 'overdue' | 'normal',
}


export declare interface SQLCallback {
  affectedRows: number;
  fieldCount: number;
  info: string;
  insertId: number;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

export declare interface FindUserSource {
  apply_id: string,
  SSID: string,
  user: string,
  name: string,
  reason: string,
  apply_status: 'process' | 'process-pass' | 'process-forbid',
  event_status: 'wait' | 'out' | 'normal'|'back',
  user_status: 'overdue' | 'normal',
  first_time: string,
  last_time: string,
  process_time: string,
  out_time: string,
  back_time: string,
}

export declare interface system_info {
  sql_version: string,
  ip_field: string,
  ip_base: number,
  ip_range: number,
  port: number,
  cupboard_num: number
}

export declare interface RouterArray{
  title:string,
  to:string,
  icon:string,
  color:string,
  type:string,
  index:number
}

export declare interface Router_Array{
  root:RouterArray[],
  normal:RouterArray[],
  guest:RouterArray[],
  all:RouterArray[]
}

export declare interface MySQLSetting{
  INIT_SQL: DatabaseConfig;
  SQL: DatabaseConfig;
  SQL_Backup: DatabaseConfig;
  SQLSetting: {
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
    waitForConnections: boolean;
    connectionLimit: number;
    maxIdle: number;
    idleTimeout: number;
    queueLimit: number;
    enableKeepAlive: boolean;
    keepAliveInitialDelay: number;
    multipleStatements: boolean;
  }
}

export declare interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  database?: string;
  password: string;
  waitForConnections: boolean;
  connectionLimit: number;
  maxIdle: number;
  idleTimeout: number;
  queueLimit: number;
  enableKeepAlive: boolean;
  keepAliveInitialDelay: number;
  multipleStatements: boolean;
}
