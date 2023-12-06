let ValorImpuesto = 0;
$(document).ready(function () {

    fetch("/Cliente/Lista")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            // Clear existing options before appending new ones
            $("#txtNombreCliente").empty();

            if (responseJson.data && responseJson.data.length > 0) {
                responseJson.data.forEach((item) => {
                    $("#txtNombreCliente").append(
                        $("<option>").val(item.idCliene).text(item.nomRaz.trim())
                    );
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    fetch("/Venta/ListaTipoDocumentoVenta")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);

        })
        .then(responseJson => {
            if (responseJson.length > 0) {
                responseJson.forEach((item) => {
                    $("#cboTipoDocumentoVenta").append(
                        $("<option>").val(item.idTipoDocumentoVenta).text(item.descripcion)
                    )
                })
            }

        })

    fetch("/Negocio/Obtener")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);

        })
        .then(responseJson => {
            if (responseJson.estado) {
                const d = responseJson.objeto;

                console.log(d);

                $("#inputGroupSubTotal").text(`Sub total - ${d.simboloMoneda}`);
                $("#inputGroupIGV").text(`IGV(${d.porcentajeImpuesto}) - ${d.simboloMoneda}`);
                $("#inputGroupTotal").text(`Total - ${d.simboloMoneda}`);
                ValorImpuesto= parseFloat(d.porcentajeImpuesto);

            }


        })
    $("#cboBuscarProducto").select2({
        ajax: {
            url: "/Venta/ObtenerProductos",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            delay: 250,
            data: function (params) {
                return {
                    busqueda: params.term
                };
            },
            processResults: function (data) {
               
                

                return {
                    results: data.map((item) => ({
                        id: item.idProducto,
                        text: item.descripcion,

                        marca: item.marca,
                        categoria: item.nombreCategoria,
                        urlImagen: item.urlImagen,
                        precio: parseFloat(item.precio)
                    }
                    ))
                };
            }
            
        },
        language: "es",
        placeholder: 'Buscar Producto',
        minimumInputLength: 1,
        templateResult: formatoResultados
    });


})

function formatoResultados(data) {
    if (data.loading)
        return data.text;

    var contenedor = $(
        `<table width = "100%">
        <tr>
            <td style = "width:60px">
            <img style ="height:60px;width:60px;margin-right:10px" src = "${data.urlImagen}"/>
            </td>
            <td>
                <p style="font-weigth: bolder;margin:2px">${data.marca}</p>
                 <p style="margin:2px">${data.text}</p>
                 </td>
               </tr>
               </table>`);
return contenedor;

}


$(document).on("select2:open", function () {
    document.querySelector(".select2-search__field").focus();
})

let ProductosParaVenta = []; //array

$("#cboBuscarProducto").on("select2:select", function (e) {
    const data = e.params.data;

    let producto_encontrado = ProductosParaVenta.filter(p => p.idProducto == data.id);

    if(producto_encontrado.length>0){
        $("#cboBuscarProducto").val(null).trigger("change");
        toastr.warning("", "El producto ya se encuentra en la lista")
        return false
    }

    swal({
        title: data.marca,
        text: data.text,
        imageUrl: data.urlImagen,
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "Cantidad",
    },
        function (valor) {

            if (valor === false) return false;

            if (valor === "") {
                toastr.warning("", "Necesita ingresar la cantidad")
                return false;
            }
            if (isNaN(parseInt(valor))) { ///)))
                toastr.warning("", "La cantidad debe ser un número")
                return false;
            }
            let producto = {
                idProducto: data.id,
                marca: data.marca,
                descripcionProducto: data.text,
                categoria: data.categoria,
                cantidad: parseInt(valor),
                precio: data.precio.toString(),
                total: (parseFloat(data.precio) * parseInt(valor)).toString()

            }

            ProductosParaVenta.push(producto);
            mostrarProductos_Precios();
            $("#cboBuscarProducto").val("").trigger("change");
            swal.close();
        }
    )



})

function mostrarProductos_Precios() {
    let total = 0;
    let igv = 0;
    let subtotal = 0;
    
    let porcentaje = ValorImpuesto / 100;

    $("#tbProducto tbody").html("")

    ProductosParaVenta.forEach((item) => {

        total = total + parseFloat(item.total);

        $("#tbProducto tbody").append(
            $("<tr>").append(
                $("<td>").append(
                    $("<button>").addClass("btn btn-danger btn-eliminar btn-sm").append(
                        $("<i>").addClass("fa fa-trash-alt")
                    ).data("IdProducto", item.idProducto)
                ),
                $("<td>").text(item.descripcionProducto),
                $("<td>").text(item.cantidad),
                $("<td>").text(item.precio),
                $("<td>").text(item.total)
            )
        )
    })

    subtotal = total / (1 + porcentaje);
    igv = total - subtotal;

    $("#txtSubTotal").val(subtotal.toFixed(2));
    $("#txtIGV").val(igv.toFixed(2));
    $("#txtTotal").val(total.toFixed(2));
}
$('#cboTipoDocumentoVenta').on('change', function () {
    var selectedValue = $(this).val();

    if (selectedValue === 'factura') {
        // Agregar el contenido HTML cuando el valor es 'factura'
        $('#cboTipoDocumentoVenta').after(`
                    <div class="card shadow mb-4">
                        <div class="card-header py-3 bg-second-primary">
                            <h6 class="m-0 font-weight-bold text-white">Cliente</h6>
                        </div>
                        <div class="card-body">
                            <div class="form-row">
                                <div class="form-group col-sm-6">
                                    <input type="text" class="form-control form-control-sm" id="txtDocumentoCliente" placeholder="numero documento">
                                </div>
                                <div class="form-group col-sm-6">
                                    <select class="form-control form-control-sm" id="txtNombreCliente">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
    } else {
        // Eliminar el contenido HTML cuando el valor no es 'factura'
        $('#cboTipoDocumentoVenta').next('.card').remove();
    }
});
$(document).on("click", "button.btn-eliminar", function () {
    const _idProducto = $(this).data("IdProducto");

    ProductosParaVenta = ProductosParaVenta.filter(p => p.idProducto != _idProducto);

    mostrarProductos_Precios();
})      

$("#btnTerminarVenta").click(function () {

    if(ProductosParaVenta.length< 1){
        toastr.warning("", "No hay productos para la venta")
        return false;
    }

    const vmDetalleVenta = ProductosParaVenta;

    const venta = {
        idTipoDocumentoVenta: $("#cboTipoDocumentoVenta").val(),
        documentoCliente: $("#txtDocumentoCliente").val(),
        nombreCliente: $("#txtNombreCliente").val(),
        subTotal: $("#txtSubTotal").val(),
        impuestoTotal: $("#txtIGV").val(),
        total: $("#txtTotal").val(),
        DetalleVenta: vmDetalleVenta
    }

    $("#btnTerminarVenta").LoadingOverlay("show");

    fetch("/Venta/RegistrarVenta", {
            method: "POST",
            headers: { "Content-Type":"application/json; charset=utf-8" },
            body: JSON.stringify(venta)
    })
        .then(response => {
            $("#btnTerminarVenta").LoadingOverlay("hide");
            return response.ok ? response.json() : Promise.reject(response);

        })
        .then(responseJson => {

            if (responseJson.estado) {
                ProductosParaVenta = [];
                mostrarProductos_Precios();

                $("txtDocumentoCliente").val("")
                $("txtNombreCliente").val("")
                $("#cboTipoDocumentoVenta").val($("#cboTipoDocumentoVenta option:first").val())

                swal("Registrado!", `Numero de venta: ${responseJson.objeto.numeroVenta}`, "success")
            } else {
                swal("Lo Sentimos!", "No se pudo regitrar la venta", "error")
            }


        })
})

