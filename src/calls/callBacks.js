const {ipcMain,dialog} = require("electron");
const callBack = (element) => {
    ipcMain.on('renderer-to-main', (event,message) => {
        if(![null,undefined].includes(message.data)){

        }else{
            switch (message) {
                case "close":
                    element.hide();
                    break;
                case "validate":
                    salute();
                    break;
            }
        }
    });
}

const salute = () => {
    dialog.showMessageBox({
        title: "Salute",
        message: "Hello World"
    });
}

module.exports = {
    callBack
}