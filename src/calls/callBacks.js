const {ipcMain, dialog} = require("electron");
const {BrowserWindow} = require('electron');
const {join} = require("path");
const {setHtmlSize, responsiveWindows} = require('../commons/utilities');
const axios = require('axios');
const http = axios.create({
    baseURL: 'http://3.15.143.154:8082/api/v1',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});

let userType = 0;

const callBack = async (element) => {
    ipcMain.on('event', (event, message) => {
        const JSONMessage = JSON.parse(message);
        if (![null, undefined].includes(JSONMessage.data)) {
        } else {
            switch (JSONMessage.action) {
                case "close":
                    element.close();
                    break;
                case "minimize":
                    element.minimize();
                    break;
                case "maximize":
                    element.maximize();
                    break;
                case "validate":
                    validateCredentials(element, JSONMessage);
                    break;
            }
        }
    });
    ipcMain.on('return-data', (event, message) => {
        event.returnValue = userType;
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
        await openWindow(element, response.data.type);
    }
}

const openWindow = async (element, type) => {
    userType = type;
    element.loadFile(join(__dirname, '../views/menu.html')).then(() => {
    });
    setHtmlSize(element);
    await responsiveWindows(element);

}

module.exports = {
    callBack
}