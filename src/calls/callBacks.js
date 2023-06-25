const {ipcMain, dialog} = require("electron");
const {BrowserWindow} = require('electron');
const {join} = require("path");
const {setHtmlSize, responsiveWindows} = require('../commons/utilities');
const axios = require('axios');
const http = axios.create({
    baseURL: 'http://127.0.0.1:8082/api/v1',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

const callBack = async (element) => {
    ipcMain.on('renderer-to-main', (event, message) => {
        const JSONMessage = JSON.parse(message);
        if (![null, undefined].includes(JSONMessage.data)) {
        } else {
            console.log(JSONMessage);
            switch (JSONMessage.action) {
                case "close":
                    element.hide();
                    break;
                case "validate":
                    validateCredentials(element, JSONMessage);
                    break;
            }
        }
    });
}

const validateCredentials = async (element, message) => {
    const response = await http.post('/login', message);
    if (response.data.status === false) {
        const notifier = require('node-notifier');
        notifier.notify({
            title: 'Error',
            message: response.data.message,
        });
    } else {
        await openWindow(element);
    }
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

    menu.loadFile(join(__dirname, '../views/menu.html')).then(() => {
    });
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