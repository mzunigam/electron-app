const DOM = {
    init() {
        this.getData().then(console.log);
    },
    elementEvents() {

    },
    getElements() {

    },
    async getData() {
        const respuesta = await fetch('http://127.0.0.1:8082/api/v1/campos');
        const json = await respuesta.json();
        if (json.status) {
            this.initDataTable(json.data);
        } else {
            console.log(json.message);
        }
        return json;
    },
    initDataTable(data) {
        $('#tblPrincipal').DataTable({
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
                {"data": "fecha_inicio"},
                {"data": "fecha_inicio"},
                {"data": "fecha_inicio"},

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

document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
});