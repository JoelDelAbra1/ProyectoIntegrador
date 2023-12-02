const MODELO_BASE = {
    idCliene: 0,
    nomRaz: "",
    correo: "",
    telefono: "",
    regimen: "",
    rfc: "",
    codigoPostal: ""
}


let tablaData;
$(document).ready(function () {


    tablaData = $('#tbdata').DataTable({
        responsive: true,
        "ajax": {
            "url": '/Cliente/Lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "idCliene", "visible": false, "searchable": false },
            { "data": "nomRaz"},
            { "data": "correo"},
            { "data": "telefono"},
            { "data": "regimen"},
            { "data": "rfc"},

            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-danger btn-eliminar btn-sm"><i class="fas fa-trash-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }
        ],
        order: [[0, "desc"]],
        dom: "Bfrtip",
        buttons: [
            {
                text: 'Exportar Excel',
                extend: 'excelHtml5',
                title: '',
                filename: 'Reporte Clientes',
                exportOptions: {
                    columns: [1, 2,3,4,5]
                }
            }, 'pageLength'
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });
})

function mostrarModal(modelo = MODELO_BASE) {

    $("#txtId").val(modelo.idCliene)
    $("#txtNombre").val(modelo.nomRaz)
    $("#txtCorreo").val(modelo.correo)
    $("#txtTelefono").val(modelo.telefono)
    $("#txtRegimen").val(modelo.regimen)
    $("#txtRfc").val(modelo.rfc)
    $("#txtcodigoPostal").val(modelo.codigoPostal)

    $("#modalData").modal("show")
}

$("#btnNuevo").click(function () {
    mostrarModal()
})

$("#btnGuardar").click(function () {

    const inputs = $("input.input-validar").serializeArray();
    const inputs_sin_valor = inputs.filter((item) => item.value.trim() == "")

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        toastr.warning("", mensaje)
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus()
        return;

    }


    const modelo = structuredClone(MODELO_BASE);

    modelo["idCliene"] = parseInt($("#txtId").val())
    modelo["nomRaz"] = $("#txtNombre").val()
    modelo["correo"] = $("#txtCorreo").val()
    modelo["telefono"] = $("#txtTelefono").val()
    modelo["regimen"] = $("#txtRegimen").val()
    modelo["rfc"] = $("#txtRfc").val()
    modelo["codigoPostal"] = $("#txtcodigoPostal").val()

 

    $("#modalData").find("div.modal-content").LoadingOverlay("show");

    if (modelo.idCliene == 0) {
        fetch("/Cliente/Crear", {
            method: "POST",
            headers: {"Content-Type":"application/json; charset=utf-8" },
            body: JSON.stringify(modelo)

        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    tablaData.row.add(responseJson.objeto).draw(false)
                    $("#modalData").modal("hide")
                    swal("Listo!", "La cateogria fue creada", "success")


                } else {
                    swal("Lo sentimos", responseJson.mensaje, "error")
                }
            })

    } else {
        fetch("/Cliente/Editar", {
            method: "PUT",
            headers: {"Content-Type":"application/json; charset=utf-8" },
            body: JSON.stringify(modelo)

        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    tablaData.row(filaSeleccionada).data(responseJson.objeto).draw(false);
                    filaSeleccionada = null
                    $("#modalData").modal("hide")
                    swal("Listo!", "La cateogria ha sido modificada", "success")


                } else {
                    swal("Lo dsasd", responseJson.mensaje, "error")
                }
            })


    }
})

let filaSeleccionada;
$("#tbdata tbody").on("click", ".btn-editar", function () {
    if ($(this).closest("tr").hasClass("child")) {
        filaSeleccionada = $(this).closest("tr").prev();


    } else {
        filaSeleccionada = $(this).closest("tr");
    }

    const data = tablaData.row(filaSeleccionada).data();
    console.log((data))
    

    mostrarModal(data);
})



$("#tbdata tbody").on("click", ".btn-eliminar", function () {

    let fila;
    if ($(this).closest("tr").hasClass("child")) {
        fila = $(this).closest("tr").prev();


    } else {
        fila = $(this).closest("tr");
    }

    const data = tablaData.row(fila).data();
    console.log(data)

    swal({
        title: "Estas seguro?",
        text: `Eliminar a "${data.nomRaz}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (respuesta) {

            if (respuesta) {
                $(".showSweetAlert").LoadingOverlay("show");
                fetch(`/Cliente/Eliminar?idCliente=${data.idCliene}`, {
                    method: "DELETE"

                })
                    .then(response => {
                        $(".showSweetAlert").LoadingOverlay("hide");
                        return response.ok ? response.json() : Promise.reject(response);
                    })
                    .then(responseJson => {

                        if (responseJson.estado) {

                            tablaData.row(fila).remove().draw()
                            swal("Listo!", "El cliente fue eliminada", "success")


                        } else {
                            swal("Lo sentimos", responseJson.mensaje, "error")
                        }
                    })

            }

        }
    )
})

