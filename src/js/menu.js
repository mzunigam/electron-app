let datatable = null;
let creating = false;
let editing = false;
let deleting = false;
let dataCarpeta = null;
const DOM = {
    async init() {
        await this.getData();
        await this.loadData();
        this.elementEvents();
    },
    elementEvents() {
        document.getElementById("btnNuevo").addEventListener('click', async () => {
            await insertarNuevaFila();
        });
        document.getElementById("btnBuscar").addEventListener('click', async () => {
            document.getElementById('btnBuscar').disabled = true;
            if (datatable !== null) {
                datatable.destroy();
                $('#tblPrincipal tbody').empty();
            }
            await this.getData();
            document.getElementById('btnBuscar').disabled = false;
        });
        document.getElementById("btnLimpiar").addEventListener('click', async () => {
            document.getElementById('campo').value = '';
            document.getElementById('modulo').value = 0;
            if (datatable !== null) {
                datatable.destroy();
                $('#tblPrincipal tbody').empty();
            }
            datatable = null;
        });
    },
    async getData() {
        const respuestaCampos = await fetch('http://127.0.0.1:8082/api/v1/campo/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                campo: document.getElementById('campo').value,
                id_modulo: Number(document.getElementById('modulo').value),
            }),
        });
        const jsonCampos = await respuestaCampos.json();
        if (jsonCampos.status) {
            this.initDataTable(jsonCampos.data);
        } else {
            this.initDataTable(jsonCampos.data);
        }
        return jsonCampos;
    },
    async loadData() {
        const respuestaModulos = await fetch('http://127.0.0.1:8082/api/v1/modulo');
        const jsonModulos = await respuestaModulos.json();
        document.getElementById('modulo').innerHTML = '<option value="0">[TODOS]</option>' + jsonModulos.map(modulo => {
            return `<option value="${modulo["id_modulo"]}">${modulo["nomb_modulo"]}</option>`;
        }).join('');
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
                {
                    "data": null, render: function (data, type, row) {
                        return '';
                    }
                },
                {
                    "data": "nomb_campo", render: function (data, type, row) {
                        return `<div class="text-center nomb_campo">${data}</div>`;
                    },
                },
                {
                    "data": "descripcion", render: function (data, type, row) {
                        return `<div class="text-center descripcion">${data}</div>`;
                    },
                },
                {
                    "data": "nomb_carpeta", render: function (data, type, row) {
                        return `<div class="text-center id_carpeta">${data}</div>`;
                    },
                },
                {
                    "data": "nomb_modulo", render: function (data, type, row) {
                        return `<div class="text-center id_modulo">${data}</div>`;
                    },
                },
                {
                    "data": "id_campo", render: function (data, type, row) {
                        return `
                    <div class="acciones">
                    <button type="button" class="btn btn-primary btn-sm btnEditar"><i class="fa fa-edit"></i></button>
                    <button type="button" class="btn btn-danger btn-sm btnEliminar"><i class="fa fa-trash"></i></button>
                    </div>
                    `
                    }
                },
            ],
            columnDefs: [
                {targets: 0, orderable: false, width: '1%', className: 'center'},
                {targets: 1, orderable: false, width: '20%', className: 'text-center'},
                {targets: 2, orderable: false, width: '27.5%', className: 'text-center'},
                {targets: 3, orderable: false, width: '17.5%', className: 'text-center'},
                {targets: 4, orderable: false, width: '15%', className: 'text-center'},
                {targets: 5, orderable: false, width: '17.5%', className: 'text-center'},
                // {targets: 5, orderable: false, width: '17.5%', className: 'text-center'},
            ],
            bSort: false,
            bFilter: false,
            aaSorting: [0],
            ordering: false,
            bLengthChange: false,
            bInfo: true,
            paging: true,
            pageLength: 5,
            stateSave: true,
            rowCallback: function (row, data, index) {
                $(row).find('.btnEditar').on('click', async (e) => {
                    await editarFila(row, data, index);
                });
                $(row).find('.btnEliminar').on('click', async (e) => {
                    await eliminarFila(row, data, index);
                });
            }
        });
        datatable.column(0).visible(false);
    }
};

const comboCarpeta = async () => {
    const respuesta = await fetch('http://127.0.0.1:8082/api/v1/carpeta/get');
    if (respuesta.status === 200) {
        const json = await respuesta.json();
        return json.map(x => {
            return '<option data-value="" value="0" data-id="0">[SELECCIONE]</option>' +
                `<option data-value="${x["nomb_modulo"]}" data-id="${x["id_modulo"]}" value="${x["id_carpeta"]}">${x["nomb_carpeta"]}</option>`;
        }).join('');
    }
}

const insertarNuevaFila = async () => {
    $('.dataTables_empty').remove();
    document.getElementById('btnNuevo').disabled = true;
    if (document.querySelectorAll('.row-creating').length > 0) {
        document.querySelectorAll('.row-creating').forEach(x => x.remove());
    }

    creating = true;
    const nomb_campo = `<input type="text" class="form-control" id="nomb_campo" name="nomb_campo" placeholder="Nombre del campo">`;
    const descripcion = `<input type="text" class="form-control" id="descripcion" name="descripcion" placeholder="Descripción">`;
    const id_carpeta = `<select class="form-control" style="padding-left: 0.5rem" id="id_carpeta" >${dataCarpeta}</select>`;
    const id_modulo = `<div class="text-center" id="id_modulo"></div>`;
    const td = `<tr class="row-creating" style="background: #e7f7ff;">
<!--                    <td></td>-->
<!--                    <td></td>-->
                    <td>${nomb_campo}</td>
                    <td>${descripcion}</td>
                    <td>${id_carpeta}</td>
                    <td>${id_modulo}</td>
                    <td>
                    <div class="d-flex justify-content-center">
                        <button type="button" id="btnGuardar" class="btn btn-success btn-sm">
                        <i class="fa fa-save"></i>
                        </button>
                    </div>
                    </td>
               </tr>`;
    document.getElementById('tblPrincipal').getElementsByTagName('tbody')[0].insertAdjacentHTML('beforebegin', td);
    document.getElementById("id_carpeta").addEventListener('change', async () => {
        document.getElementById('id_modulo').innerHTML = document.getElementById("id_carpeta").selectedOptions[0].getAttribute("data-value")
    });
    document.getElementById('btnGuardar').addEventListener('click', async () => {
        document.getElementById('btnNuevo').disabled = true;
        document.getElementById('btnGuardar').disabled = true;
        const body = {
            id_campo: 0,
            nomb_campo: document.getElementById('nomb_campo').value,
            descripcion: document.getElementById('descripcion').value,
            id_carpeta: Number(document.getElementById('id_carpeta').value),
            id_modulo: Number(document.getElementById('id_carpeta').selectedOptions[0].getAttribute("data-id"))
        };

        if(body.nomb_campo === "" || body.descripcion === "" || body.id_carpeta === 0){
            const msg_info = document.getElementById("msg_info");
            msg_info.innerHTML = "Debe completar todos los campos";
            msg_info.classList.add("badge-danger");
            setTimeout(() => {
                msg_info.classList.remove("badge-danger");
                msg_info.innerHTML = "";
                document.getElementById('btnGuardar').disabled = false;
            },3000);
            return;
        }

        const respuesta = await fetch('http://127.0.0.1:8082/api/v1/campo', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await respuesta.json();
        const msg_info = document.getElementById("msg_info");
        msg_info.innerHTML = json["message"];
        if (respuesta.status === 200) {
            msg_info.classList.add("badge-success");
        } else {
            msg_info.classList.add("badge-danger");
        }
        setTimeout(() => {
            msg_info.classList.remove("badge-success");
            msg_info.classList.remove("badge-danger");
            msg_info.innerHTML = "";
        }, 3000);
        document.getElementById('btnNuevo').disabled = false;
        document.getElementById("btnBuscar").click();
    });
    document.getElementById('btnNuevo').disabled = false;
};

const editarFila = async (row, data, index) => {
    row.querySelector('.nomb_campo').innerHTML = `
            <input type="text" class="form-control" id="nomb_campo" name="nomb_campo" value="${data["nomb_campo"]}"/>
    `;
    row.querySelector('.descripcion').innerHTML = `
          <input type="text" class="form-control" id="descripcion" name="descripcion" value="${data["descripcion"]}"/>
    `;

    row.querySelector('.id_carpeta').innerHTML = `<select class="form-control" id="id_carpeta">${dataCarpeta}</select>`;
    $(row.querySelector('.id_carpeta')).on('change', async () => {
        row.querySelector('.id_modulo').innerHTML = row.querySelector("#id_carpeta").selectedOptions[0].getAttribute("data-value")
    });
    row.querySelector('#id_carpeta').value = data["id_carpeta"];
    row.querySelector('.acciones').innerHTML = `
    <button class="btn btn-sm btn-primary btnGuardarEdicion"><i class="fa fa-save"></i></button>
    <button class="btn btn-sm btn-outline-secondary btnVolver"><i class="fa fa-redo"></i></button>
    `;

    row.querySelector('.btnGuardarEdicion').addEventListener('click', async () => {
        const body = {
            id_campo: data["id_campo"],
            nomb_campo: row.querySelector('#nomb_campo').value,
            descripcion: row.querySelector('#descripcion').value,
            id_carpeta: Number(row.querySelector('#id_carpeta').value),
            id_modulo: Number(row.querySelector('#id_carpeta').selectedOptions[0].getAttribute("data-id"))
        };

        if(body.nomb_campo === "" || body.descripcion === "" || body.id_carpeta === 0){
            const msg_info = document.getElementById("msg_info");
            msg_info.innerHTML = "Debe completar todos los campos";
            msg_info.classList.add("badge-danger");
            // setTimeout(() => {
            //     msg_info.classList.remove("badge-danger");
            //     msg_info.innerHTML = "";
            //     document.getElementById('btnGuardar').disabled = false;
            // },3000);
            return;
        }

        const respuesta = await fetch('http://127.0.0.1:8082/api/v1/campo', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await respuesta.json();
        const msg_info = document.getElementById("msg_info");
        msg_info.innerHTML = json["message"];
        if (respuesta.status === 200) {
            msg_info.classList.add("badge-success");

        } else {
            msg_info.classList.add("badge-danger");
        }
        // setTimeout(() => {
        //     msg_info.classList.remove("badge-success");
        //     msg_info.classList.remove("badge-danger");
        //     msg_info.innerHTML = "";
        // }, 3000);
    });
}

const eliminarFila = async (row, data, index) => {
    const respuesta = await fetch('http://127.0.0.1:8082/api/v1/campo/' + data["id_campo"], {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const json = await respuesta.json();
    const msg_info = document.getElementById("msg_info");
    msg_info.innerHTML = json["message"];
    if (respuesta.status === 200) {
        msg_info.classList.add("badge-success");
        document.getElementById("btnBuscar").click();
    } else {
        msg_info.classList.add("badge-danger");
    }
    setTimeout(() => {
        msg_info.innerHTML = "";
        msg_info.classList.remove("badge-success", "badge-danger");
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    DOM.init().then(async () => {
        dataCarpeta = await comboCarpeta();
    });
});