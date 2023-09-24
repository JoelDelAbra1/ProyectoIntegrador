
$(document).ready(function () {



    $("div.container-fluid").LoadingOverlay("show");


    fetch("/Negocio/Obtener")
        .then(response => {
            $(".card-body").LoadingOverlay("hide");

            return response.ok ? response.json() : Promise.reject(response);

        })
        .then(responseJson => {

            console.log(responseJson)

            if (responseJson.estado) {
                console.log(responseJson.objeto)
                const d = responseJson.objeto


                $("#txtNumeroDocumento").val(d.numeroDocumento);
                $("#txtRazonSocial").val(d.nombre)
                $("#txtCorreo").val(d.correo)
                $("#txtDireccion").val(d.direccion)
                $("#txTelefono").val(d.telefono)
                $("#txtImpuesto").val(d.porcentajeImpuesto)
                $("#txtSimboloMoneda").val(d.simboloMoneda)
                $("#imgLogo").attr("src", d.urlLogo)

            } else {
                swal("Lo sentimos", responseJson.mensaje, "error")
            }

        })
})