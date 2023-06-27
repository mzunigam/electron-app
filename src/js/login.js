const DOM = {
    init() {
        DOM.elementEvents();
    },
    elementEvents() {
        const btnIniciar = document.getElementById('btnIniciar');
        const btnCancelar = document.getElementById('btnCancelar');
        if (btnIniciar) {
            btnIniciar.addEventListener('click', () => {
                const json = {
                    action: 'validate',
                    usuario: document.getElementById('usuario').value,
                    password: document.getElementById('password').value
                };
                window["electronAPI"].event(JSON.stringify(json));
            });
        }
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                window["electronAPI"].event(JSON.stringify({action: 'close'}));
            });
        }
        const usuario = document.getElementById('usuario');
        const password = document.getElementById('password');
        if (usuario) {
            usuario.addEventListener('keyup', (e) => {
                if (e['keyCode'] === 13) {
                    password.focus();
                }
            });
        }
        if (password) {
            password.addEventListener('keyup', (e) => {
                if (e['keyCode'] === 13) {
                    btnIniciar.click();
                }
            });
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
});