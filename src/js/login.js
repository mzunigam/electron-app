const DOM = {
    init(){
        DOM.elementEvents();
    },
    elementEvents(){
        const btnIniciar = document.getElementById('btnIniciar');
        const btnCancelar = document.getElementById('btnCancelar');
        btnIniciar.addEventListener('click', () => {
            const json = {
                action: 'validate',
                usuario : document.getElementById('usuario').value,
                password : document.getElementById('password').value
            };
            window["electronAPI"].rendererMain(JSON.stringify(json));
        });
        btnCancelar.addEventListener('click', () => {

            window["electronAPI"].rendererMain(JSON.stringify({action: 'close'}));
        });
    },
};

document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
});