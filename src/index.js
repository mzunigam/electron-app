const {app,BrowserWindow, ipcMain} = require('electron');
const {join} = require("path");
const {setHtmlSize}  = require('./commons/utilities');
const init = async () => {

    const login = new BrowserWindow({
        minWidth: 100,
        height: 100,
        webPreferences: {
            // nodeIntegration: true,
            preload: join(__dirname, 'preload.js')
        },
        transparent: true,
        frame: false,
        // autoHideMenuBar: true,
    });

    login.loadFile(join(__dirname, '/views/login.html')).then(()=> {});
    setHtmlSize(login);
    login.setResizable(false);
    login.on('close', (e) => {
        e.preventDefault();
        login.hide();
    });

    ipcMain.on('main-to-renderer', (event) => {
        event.returnValue = 'Hello from main process';
    });

    ipcMain.on('renderer-to-main', (event) => {

    });
}

app.whenReady().then(init);