let ValorImpuesto = 0;
$(document).ready(function () {

    let clientes = []; // Almacena la información de los clientes

    // Cargar la lista de clientes y almacenarla en la variable clientes
    fetch("/Cliente/Lista")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            clientes = responseJson.data || [];

            // Llenar el select con la lista de clientes
            $("#txtNombreCliente").empty();
            if (clientes.length > 0) {
                clientes.forEach((item) => {
                    $("#txtNombreCliente").append(
                        $("<option>").val(item.idCliene).text(item.nomRaz.trim())
                    );
                });
            }

            // Mostrar información del primer cliente (si existe)
            if (clientes.length > 0) {
                mostrarInformacionCliente(clientes[0].idCliene);
            }
        })
        .catch(error => {
           
        });


    // Evento de cambio en el select de clientes
    $("#txtNombreCliente").on("change", function () {
        const selectedClientId = $(this).val();
        mostrarInformacionCliente(selectedClientId);
    });

    // Función para mostrar la información del cliente seleccionado
    function mostrarInformacionCliente(clienteId) {
        // Buscar el cliente en la lista
        const clienteSeleccionado = clientes.find(cliente => cliente.idCliene == clienteId);

        console.log(clienteSeleccionado);

        // Actualizar la información en el elemento con id "nombre"
        if (clienteSeleccionado) {
            $("#nombre").val(clienteSeleccionado.nomRaz);
            $("#rfc").val(clienteSeleccionado.rfc);
            $("#regimen").val(clienteSeleccionado.regimen);
            $("#codigoPostal").val(clienteSeleccionado.codigoPostal);
        }
    }



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
                        precio: parseFloat(item.precio),
                        descuento: parseFloat(item.descuento),
                        factorImpuesto: item.factorImpuesto,
                        impuestos: item.impuestos,
                        productoServicio: item.productoServicio,
                        tipoImpuesto: item.tipoImpuesto,
                        unidad: item.unidad,
                        valorImpuesto: item.valorImpuesto
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

    console.log(data);
     debugger;

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
                descuento: data.descuento.toString(), 
                totalDescuetno: (parseFloat(data.descuento) * parseInt(valor)).toString(),
                total: ((parseFloat(data.precio) * parseInt(valor)) - (parseFloat(data.descuento) * parseInt(valor))).toString(),
                factorImpuesto: data.factorImpuesto,
                impuestos: data.impuestos,
                productoServicio: data.productoServicio,
                tipoImpuesto: data.tipoImpuesto,
                unidad: data.unidad,
                valorImpuesto: data.valorImpuesto

            }
            console.log(producto);
            debugger;

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
    let descuento = 0;
    
    let porcentaje = ValorImpuesto / 100;

    $("#tbProducto tbody").html("")

    ProductosParaVenta.forEach((item) => {

        total = total + parseFloat(item.total);
        descuento = descuento + parseFloat(item.totalDescuetno);

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
                $("<td>").text(item.descuento),
                $("<td>").text(item.totalDescuetno),
                $("<td>").text(item.total)
            )
        )
    })

    subtotalAD = total / (1 + porcentaje) + descuento;
    subtotal = subtotalAD - descuento;
    igv = total - subtotal;

    $("#txtSubTotal").val(subtotal.toFixed(2));
    $('#txtSubTotalAD').val(subtotalAD.toFixed(2))
    $("#txtDescuento").val(descuento.toFixed(2))
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
        subtotalAD: $('#txtSubTotalAD').val(),
        descuentos: $("#txtDescuento").val(),
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


let concepto = '';
$("#btnBuscar").click(function () {
    if ($("#txtNumeroVenta").val().trim() == "") {

        toastr.warning("", "Debe ingresar el numero de venta")
        return;
    }


    let numeroVenta = $("#txtNumeroVenta").val()

    $(".card-body").find("div.row").LoadingOverlay("show");
    fetch(`/Venta/Historial?numeroVenta=${numeroVenta}`)
        .then(response => {
            $(".card-body").find("div.row").LoadingOverlay("hide");

            return response.ok ? response.json() : Promise.reject(response);

        })
        .then(responseJson => {


            $("#tbProductos tbody").html("");

            if (responseJson.length > 0) {

                if (responseJson.length > 0) {

                    responseJson.forEach((venta) => {
                        $("#txtSubTotal").val(venta.subTotal)
                        $("#txtIGV").val(venta.impuestoTotal)
                        $("#txtTotal").val(venta.total)
                        $("#txtSubTotalAD").val(venta.subTotalAd)
                        $("#txtDescuento").val(venta.descuentos)
                        venta.detalleVenta.forEach((detalle) => {
                            $("#tbProductos tbody").append(
                                $("<tr>").append(
                                    $("<td>").text(detalle.descripcionProducto),
                                    $("<td>").text(detalle.cantidad),
                                    $("<td>").text(detalle.precio),
                                    $("<td>").text(detalle.descuento),
                                    $("<td>").text(detalle.total),
                                   
                                    
                                )
                            );
                            concepto +=`<Concepto><claveProdServ>${detalle.productoServicio}</claveProdServ><noIdentificacion>${detalle.idProducto}</noIdentificacion><cantidad>${detalle.cantidad}</cantidad><claveUnidad>${detalle.unidad}</claveUnidad><unidad>HOla</unidad><descripcion>${detalle.descripcionProducto}</descripcion><valorUnitario>${detalle.precio}</valorUnitario><importe>${detalle.total}</importe><descuento>${detalle.descuento}</descuento><cuentaPredial>43027023</cuentaPredial><objetoImp>01</objetoImp></Concepto>`;
                            console.log(concepto);
                        });
                    });
                }

            }
        })
})
let comprobante = "";
$("#btnTerminarVenta").click(function () {
    const formaPago = $("#FormaPago").val();
    let moneda = $("#moneda").val();
    let tipocambio = $("#tipoCambio").val();
    let tipocomporbante = $("#tipoComprobante").val();
    let subTotal = $("#txtSubTotal").prop('value');
    let descuetos = $("#txtDescuento").prop('value');
    let total = $("#txtTotal").prop('value');
   // let metodoPago = $("#metodoPago").val();

    let regimenFiscal = $("#regimen").prop('value');
    let rfc = $("#rfc").prop('value');
    let nombre = $("#nombre").prop('value');
    let codigoPostal = $("#codigoPostal").prop('value');

    // Imprimir en la consola el valor de la variable dentro de las etiquetas XML
    comprobante +=`<Comprobante><idLocal>${ 4234234+ Math.floor(Math.random() * 900000000000) + 10000000}</idLocal><version>4.0</version><serie /><folio>1</folio><formaPago>${formaPago}</formaPago><condicionesDePago>CONTADO</condicionesDePago><subTotal>${total}</subTotal><descuento>${descuetos}</descuento><moneda>${moneda}</moneda><Tipocambio>${tipocambio}</Tipocambio><exportacion>01</exportacion> <total>${total}</total><tipoDeComprobante>${tipocomporbante}</tipoDeComprobante><metodoPago>PUE</metodoPago><lugarExpedicion>64100</lugarExpedicion><confirmacion></confirmacion><Relacionado /><regimenFiscal>${regimenFiscal}</regimenFiscal><rfc>${rfc}</rfc><nombre>${nombre}</nombre><residenciaFiscal></residenciaFiscal><numRegIdTrib></numRegIdTrib><usoCFDI>S01</usoCFDI><domicilioFiscalReceptor>${codigoPostal}</domicilioFiscalReceptor><regimenFiscalReceptor>616</regimenFiscalReceptor><email></email>`;
    comprobante += concepto;
    comprobante += `</Comprobante>`;

   //comprobante = '<Comprobante><idLocal>052354524587</idLocal><version>4.0</version><serie/><folio>1</folio><formaPago>01</formaPago><condicionesDePago>CONTADO</condicionesDePago><subTotal>681</subTotal><descuento>0</descuento><moneda>MXN</moneda><tipoCambio>1.00</tipoCambio><exportacion>01</exportacion><total>681</total><tipoDeComprobante>I</tipoDeComprobante><metodoPago>PUE</metodoPago><lugarExpedicion>64000</lugarExpedicion><confirmacion></confirmacion><Relacionado/><regimenFiscal>606</regimenFiscal><rfc>XAXX010101000</rfc><nombre>PUBLICO GENERAL</nombre><residenciaFiscal></residenciaFiscal><numRegIdTrib></numRegIdTrib><usoCFDI>S01</usoCFDI><domicilioFiscalReceptor>64000</domicilioFiscalReceptor><regimenFiscalReceptor>616</regimenFiscalReceptor><email></email><Concepto><claveProdServ>93161700</claveProdServ><noIdentificacion>5101</noIdentificacion><cantidad>1</cantidad><claveUnidad>E48</claveUnidad><unidad>Unidad de servicio</unidad><descripcion>43-027-023 PAGO DE ISAI FOLIO: 2022000979</descripcion><valorUnitario>681</valorUnitario><importe>681</importe><descuento>0</descuento><cuentaPredial>43027023</cuentaPredial><objetoImp>01</objetoImp></Concepto></Comprobante>';
//                   <Comprobante><idLocal>380851462771</idLocal><version>4.0</version><serie /><folio>1</folio><formaPago>01</formaPago><condicionesDePago>CONTADO</condicionesDePago><subTotal>34.48</subTotal><descuento>0</descuento><moneda>MXN</moneda><Tipocambio>1.0</Tipocambio><exportacion>01</exportacion> <total>40.00</total><tipoDeComprobante>I</tipoDeComprobante><metodoPago>PUE</metodoPago><lugarExpedicion>64100</lugarExpedicion><confirmacion></confirmacion><Relacionado /><regimenFiscal>614</regimenFiscal><rfc>XAXX010101000</rfc><nombre>Comercioalizadora Juan</nombre><residenciaFiscal></residenciaFiscal><numRegIdTrib></numRegIdTrib><usoCFDI>S01</usoCFDI><domicilioFiscalReceptor>64000</domicilioFiscalReceptor><regimenFiscalReceptor>616</regimenFiscalReceptor><email></email><Concepto><claveProdServ>10101511</claveProdServ><noIdentificacion>6</noIdentificacion><cantidad>1</cantidad><claveUnidad>E48</claveUnidad><unidad>Unidad de servicio</unidad><descripcion>Aple Watch</descripcion><valorUnitario>40.00</valorUnitario><importe>40.00</importe><descuento>0</descuento><cuentaPredial>43027023</cuentaPredial><objetoImp>01</objetoImp></Concepto></Comprobante>






    console.log(comprobante);
});


$("#btnTerminarVenta").click(function () {
    $.ajax({
        url: "/Factura/Timbrar",
        type: "GET",
        data: { comprobante: comprobante },
        xhrFields: {
            responseType: 'arraybuffer'
        },
        success: function (data) {
            var blob = new Blob([data], { type: "application/zip" });
            saveAs(blob, "Archivo.zip");
        },
        error: function (error) {
            console.error("Error en la llamada Ajax", error);
            alert("Hubo un error al llamar al servidor");
        }
    });
});
