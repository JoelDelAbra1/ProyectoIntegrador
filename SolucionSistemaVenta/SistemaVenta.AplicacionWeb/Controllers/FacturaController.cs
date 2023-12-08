using Microsoft.AspNetCore.Mvc;


namespace SistemaVenta.AplicacionWeb.Controllers
{
    public class FacturaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public ActionResult Saludar()
        {
            return Content("Hola desde el controlador");
        }


        public async Task<IActionResult> Timbrar()
        {
            // Crea una instancia del cliente del servicio web
            var cliente = new ServiceReference1.TimbradoSoapClient(ServiceReference1.TimbradoSoapClient.EndpointConfiguration.TimbradoSoap);


            try
            {
                // Llama al método TimbrarF
                var timbrarFRequest = new ServiceReference1.TimbrarFRequest
                {


                    Body = new ServiceReference1.TimbrarFRequestBody
                    {
                        Usuario = "tuUsuario",
                        Password = "tuContraseña",
                        StrXml = "<Comprobante>...</Comprobante>"
                    }
                };

                // Realiza la llamada al método TimbrarF
                var timbrarFResponse = await cliente.TimbrarFAsync("FIME",
                        "s9%4ns7q#eGq",
                       "<Comprobante>  <idLocal>4354354504</idLocal>  <version>4.0</version>  <serie />  <folio>1</folio>  <formaPago>01</formaPago>  <condicionesDePago>CONTADO</condicionesDePago>  <subTotal>681</subTotal>  <descuento>0</descuento>  <moneda>MXN</moneda>  <tipoCambio>1.00</tipoCambio> <exportacion>01</exportacion>  <total>681</total>  <tipoDeComprobante>I</tipoDeComprobante>  <metodoPago>PUE</metodoPago>  <lugarExpedicion>64000</lugarExpedicion>  <confirmacion></confirmacion>  <Relacionado />  <regimenFiscal></regimenFiscal>  <rfc>XAXX010101000</rfc>  <nombre>PUBLICO GENERAL</nombre>  <residenciaFiscal></residenciaFiscal>  <numRegIdTrib></numRegIdTrib>  <usoCFDI>S01</usoCFDI> <domicilioFiscalReceptor>64000</domicilioFiscalReceptor><regimenFiscalReceptor>616</regimenFiscalReceptor>  <email></email>  <Concepto>    <claveProdServ>93161700</claveProdServ>    <noIdentificacion>5101</noIdentificacion>    <cantidad>1</cantidad>    <claveUnidad>E48</claveUnidad>    <unidad>Unidad de servicio</unidad>    <descripcion>43-027-023 PAGO DE ISAI FOLIO: 2022000979</descripcion>    <valorUnitario>681</valorUnitario>    <importe>681</importe>    <descuento>0</descuento>    <cuentaPredial>43027023</cuentaPredial> <objetoImp>01</objetoImp>  </Concepto>  </Comprobante>"
               );

                // Procesa la respuesta según sea necesario
                if (timbrarFResponse != null && timbrarFResponse.Body != null)
                {
                    byte[] resultado = timbrarFResponse.Body.TimbrarFResult;
                    // Procesa el resultado según sea necesario
                    // Guarda el archivo ZIP
                    var fileName = "Archivo.zip";
                    System.IO.File.WriteAllBytes(fileName, resultado);

                    // Devuelve el archivo ZIP como descarga
                    return File(resultado, "application/zip", fileName);
                }
                else
                {
                    Console.WriteLine("La respuesta del servicio fue nula o no se pudo obtener el resultado.");
                }
                return Content("Timbrado exitoso");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al llamar al servicio web: {ex.Message}");
                // Maneja el error según sea necesario
                return Content($"Error al llamar al servicio web: {ex.Message}");
            }



        }
    }
}



