let datatable = null;
let creating = false;
let editing = false;
let deleting = false;
const DOM = {
    init() {
        this.getData().then(console.log);
        this.elementEvents();
    },
    elementEvents() {
        document.getElementById("btnNuevo").addEventListener('click', () => {
            insertarNuevaFila();
        });
    },
    getElements() {

    },
    async getData() {
        const respuesta = await fetch('http://127.0.0.1:8082/api/v1/campo/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        });
        const json = await respuesta.json();
        if (json.status) {
            this.initDataTable(json.data);
        } else {
            console.log(json.message);
        }
        return json;
    },
    initDataTable(data) {
        datatable = $('#tblPrincipal').DataTable({
            autoWidth: true,
            language: {
                "lengthMenu": "Mostrar: _MENU_",
                "zeroRecords": "&nbsp;&nbsp;&nbsp; No se encontraron resultados",
                "info": "&nbsp;&nbsp;&nbsp; Mostrando del _START_ al _END_ de un total de _TOTAL_ registros",
                "infoEmpty": "&nbsp;&nbsp;&nbsp; Mostrando 0 de 0 registros",
                "search": "Filtrar:",
                "loadingRecords": "Cargando...",
                "paginate": {
                    "first": "First",
                    "last": "Last",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            data: data,
            columns: [
                {"data": "id_campo"},
                {"data": "nomb_campo"},
                {"data": "descripcion"},
                {"data": "nomb_carpeta"},
                {"data": "nomb_modulo"},
            ],
            columnDefs: [
                {targets: 0, orderable: false, className: 'text-center'},
                {targets: 1, orderable: false, className: 'text-center'},
                {targets: 2, orderable: false, className: 'text-center'},
                {targets: 3, orderable: false, className: 'text-center'},
                {targets: 4, orderable: false, className: 'text-center'},
            ],
            bSort: false,
            bFilter: false,
            aaSorting: [0],
            ordering: false,
            bLengthChange: false,
            bInfo: true,
            paging: true,
        });
    }
};

const comboCarpeta = async () => {
    const respuesta = await fetch('http://127.0.0.1:8082/api/v1/carpeta');
    if (respuesta.status === 200) {
        const json = await respuesta.json();
        return json.map(x => {
            return `<option value="${x["id_carpeta"]}">${x["nomb_carpeta"]}</option>`;
        }).join('');
    }
}
const comboModulo = async () => {
    const respuesta = await fetch('http://127.0.0.1:8082/api/v1/modulo');
    if (respuesta.status === 200) {
        const json = await respuesta.json();
        return json.map(x => {
            return `<option value="${x["id_modulo"]}">${x["nomb_modulo"]}</option>`;
        }).join('');
    }
}

const insertarNuevaFila = async () => {
    creating = true;
    const nomb_campo = `<input type="text" class="form-control" id="nomb_campo" name="nomb_campo" placeholder="Nombre del campo">`;
    const descripcion = `<input type="text" class="form-control" id="descripcion" name="descripcion" placeholder="Descripción">`;
    const dataCarpeta = await comboCarpeta();
    const id_carpeta  = `<select class="form-control" id="id_carpeta" name="id_carpeta">${dataCarpeta}</select>`;
    const dataModulo = await comboModulo();
    const id_modulo   = `<select class="form-control" id="id_modulo" name="id_modulo">${dataModulo}</select>`;
    const newRow = datatable.row.add([nomb_campo, descripcion, id_carpeta, id_modulo]).draw();
    // const index = newRow.index();
    // datatable.row(index).moveTo(0);
}

document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
});