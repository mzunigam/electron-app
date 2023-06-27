const { contextBridge, ipcRenderer, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    event: (data) => ipcRenderer.send('event', data),
    ipcRenderer
});