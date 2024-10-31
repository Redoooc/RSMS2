import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import path from 'path'
import fs from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 400,
    minHeight: 700,
    fullscreen:true,
    resizable:false,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  const initWindow = new BrowserWindow({
    width: 600,
    height: 350,
    minWidth: 600,
    minHeight: 350,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // mainWindow.webContents.openDevTools()

  ipcMain.handle('fs:getPath', async (_event) => {
    if (is.dev) {
      return app.getAppPath()
    } else {
      return path.dirname(app.getPath('exe'))
    }
  })
  ipcMain.handle('fs:openDev', async (_event) => {
    mainWindow.webContents.openDevTools()
  })
  ipcMain.handle('fs:getAppPath', async (_event) => {
    return app.getAppPath()
  })
  ipcMain.handle('fs:readJSON', async (_event, _path) => {
    let pathJSON: string
    pathJSON = _path
    return ReadJson(pathJSON)
  })
  ipcMain.handle('fs:writeJSON', async (_event, _path,JsonData) => {
    return WriteJson(_path,JsonData)
  })
  ipcMain.handle('fs:readTxt', async (_event, _path) => {
    let pathTxt: string
    pathTxt = _path
    return ReadTxt(pathTxt)
  })
  ipcMain.handle('mw:initMain', async (_event) => {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    }
    else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
  })
  ipcMain.handle('mw:showMain', async (_event) => {
    mainWindow.show()
    initWindow.close()
  })
  ipcMain.handle('windows:close', async (_event)=> {
    mainWindow.close()
    app.quit()
  })

  initWindow.on('ready-to-show', () => {
    initWindow.show()
  })
  mainWindow.on('ready-to-show', () => {
    // mainWindow.show()
    mainWindow.webContents.send('ms:ready-to-show', 1)
  })

  initWindow.webContents.setWindowOpenHandler((_details) => {
    // shell.openExternal(_details.url)
    return { action: 'allow' }
  })
  mainWindow.webContents.setWindowOpenHandler((_details) => {
    // shell.openExternal(_details.url)
    return { action: 'allow' }
  })


  const isWindows = process.platform === 'win32';
  let needsFocusFix = false;
  let triggeringProgrammaticBlur = false;

  mainWindow.on('blur', (_event: any) => {
    if (!triggeringProgrammaticBlur) {
      needsFocusFix = true
    }
  })

  mainWindow.on('focus', (_event: any) => {
    if (isWindows && needsFocusFix) {
      needsFocusFix = false
      triggeringProgrammaticBlur = true
      setTimeout(function () {
        mainWindow.blur()
        mainWindow.focus()
        setTimeout(function () {
          triggeringProgrammaticBlur = false
        }, 100)
      }, 100)
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    initWindow.loadURL(process.env['ELECTRON_RENDERER_URL']+"#Init")
    // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then(() => {
    //   webContents.getAllWebContents().forEach((_wc) => {
    //     _wc.reload()
    //     _wc.reload()
    //   })
    // })
  }
  else {
    initWindow.loadFile(join(__dirname, '../renderer/index.html'),{hash:'Init'})
    // mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // mainWindow.on('resize', () => {
  //   mainWindow.webContents.executeJavaScript(`
  //       document.querySelector('body').style.zoom = ${mainWindow.getSize()[0] / 1920};
  //     `)
  // })

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.rsms2')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.commandLine.appendSwitch('high-dpi-support', '1')
app.commandLine.appendSwitch('force-device-scale-factor', '1')

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
async function ReadJson(path: string) {
  let CON = 'NO'
  // @ts-ignore
  CON = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }))
  return CON
}
async function ReadTxt(path: string) {
  let CON = 'NO'
  try {
    CON = fs.readFileSync(path, { encoding: 'utf-8' })
  }
  catch (_error)
  {
    CON = ""
  }
  // @ts-ignore
  return CON
}
async function WriteJson(path:string,data:any){
  fs.writeFileSync(path,data,'utf8')
  return true
}
