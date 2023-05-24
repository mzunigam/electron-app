const setHtmlSize = (element) => {
    element.webContents.on('did-finish-load', () => {
        const getHtmlSize = () => {
            const htmlElement = document.querySelector('body');
            const {width, height} = htmlElement.getBoundingClientRect();
            return {width, height};
        };
        element.webContents.executeJavaScript(`(${getHtmlSize.toString()})()`).then(result => {
            const {width, height} = result;
            element.setContentSize(Math.ceil(width), Math.ceil(height));
            element.setSize(Math.ceil(width), Math.ceil(height));
            element.center();
            element.show();
        });
    });
}

module.exports = {
    setHtmlSize
}