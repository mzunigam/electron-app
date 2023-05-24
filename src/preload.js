const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    rendererMain: (data) => ipcRenderer.send('renderer-to-main', data),
    mainRenderer: (callback) => ipcRenderer.on('main-to-renderer', callback),
});