const {app,BrowserWindow} = require('electron');
const {join} = require("path");
const {setHtmlSize, responsiveWindows}  = require('./commons/utilities');
const {callBack} = require("./calls/callBacks");
const init = async (element = null) => {

    if(element === null){
    element = new BrowserWindow({
        minWidth: 100,
        height: 100,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, 'preload.js')
        },
        transparent: true,
        frame: false,

    });
    }
    element.loadFile(join(__dirname, '/views/login.html')).then(()=> {});
    setHtmlSize(element);
    await responsiveWindows(element);
    element.on('close', (e) => {
        e.preventDefault();
        element.destroy();
    });
    await callBack(element);
}

app.whenReady().then(init);

module.exports = {init};