const DOM = {
    init(){
        DOM.elementEvents();
    },
    elementEvents(){
        const btnIniciar = document.getElementById('btnIniciar');
        const btnCancelar = document.getElementById('btnCancelar');
        btnIniciar.addEventListener('click', () => {
            window["electronAPI"].rendererMain('validate');
        });
        btnCancelar.addEventListener('click', () => {
            window["electronAPI"].rendererMain('close');
        });
    },
};

document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
});