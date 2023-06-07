const {ipcMain,dialog} = require("electron");
const {app,BrowserWindow} = require('electron');
const {join} = require("path");
const {setHtmlSize, responsiveWindows}  = require('../commons/utilities');

const callBack = (element) => {
    ipcMain.on('renderer-to-main', (event,message) => {
        if(![null,undefined].includes(message.data)){

        }else{
            switch (message) {
                case "close":
                    element.hide();
                    break;
                case "validate":
                    openWindow(element);
                    break;
            }
        }
    });
}

const openWindow = async (element) => {
    element.hide();

    const menu = new BrowserWindow({
        minWidth: 100,
        height: 100,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, 'preload.js')
        },
        transparent: true,
        frame: false,
    });

    menu.loadFile(join(__dirname, '../views/menu.html')).then(()=> {});
    setHtmlSize(menu);
    await responsiveWindows(menu);

    menu.once("ready-to-show", () => {
        menu.show();
    });
    menu.on('close', (e) => {
        e.preventDefault();
        menu.hide();
    });

}

module.exports = {
    callBack
}