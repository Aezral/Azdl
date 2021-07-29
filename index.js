const { app, BrowserWindow, Menu } = require('electron');
const path = require("path")
const url = require('url')
const fs = require('fs')
var configpath = process.env.APPDATA + '\\azdl\\config.json'
var configfolder = process.env.APPDATA + '\\azdl'
if (!fs.existsSync(configfolder)) {
    fs.mkdirSync(configfolder);
    fs.writeFileSync(configpath, JSON.stringify({
        notification:false,
        advanced:false,
        devtools:false
     }))
} else {
   if(!fs.existsSync(configpath)){
    fs.writeFileSync(configpath, JSON.stringify({
        notification:false,
        advanced:false,
        devtools:false
     }))
   }
}

function getconfig() {
    return JSON.parse(fs.readFileSync(configpath))
}

require('electron-reload')(__dirname, {
    ignored: /data|[/\\]\./
})

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';


let mainWindow
let loadsc
app.on('ready', () => {


    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        frame: false,
        autoHideMenuBar: true,
        resizable: false,
        show: false,
        icon: __dirname + 'src/images/logo.ico',
        title: "Azdl",
    });
    loadsc = new BrowserWindow({
        width: 300,
        height: 170, transparent: true,
        frame: false,
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        autoHideMenuBar: true,
        resizable: false,
        icon: __dirname + 'src/images/logo.ico',
        title: "A Z D L",
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    loadsc.loadURL(url.format({
        pathname: path.join(__dirname, 'src/views/load.html'),
        protocol: 'file',
        slashes: true
    }))

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });


    if (getconfig().devtools === true) {
        mainWindow.webContents.openDevTools()
    }




})







// Eventos

const ipcMain = require('electron').ipcMain;
const { config } = require('process');

ipcMain.on('close-window', () => {
    app.quit()
})

ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
})

ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
})

ipcMain.on('quitapp', () => {
    app.relaunch()
    app.quit()
})

app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.on('turndev1', () => {
    var config3 = getconfig()
    if (config3.devtools === true) {
        config3.devtools = false
        fs.writeFile(configpath, JSON.stringify(config3), 'utf-8', function () {
            app.relaunch()
            app.quit()
        })

    } else if (config3.devtools === false) {
        config3.devtools = true
        fs.writeFile(configpath, JSON.stringify(config3), 'utf-8', function () {
            app.relaunch()
            app.quit()
        })
    }


})

