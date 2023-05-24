const {app,BrowserWindow} = require('electron');
const {join} = require("path");
const {setHtmlSize, responsiveWindows}  = require('./commons/utilities');
const {callBack} = require("./calls/callBacks");
const init = async () => {

    const login = new BrowserWindow({
        minWidth: 100,
        height: 100,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, 'preload.js')
        },
        transparent: true,
        frame: false,
        // autoHideMenuBar: true,
    });
    login.loadFile(join(__dirname, '/views/login.html')).then(()=> {});
    setHtmlSize(login);
    responsiveWindows(login);
    // login.setResizable(false);
    login.on('close', (e) => {
        e.preventDefault();
        login.hide();
    });
    callBack(login);
}

app.whenReady().then(init);