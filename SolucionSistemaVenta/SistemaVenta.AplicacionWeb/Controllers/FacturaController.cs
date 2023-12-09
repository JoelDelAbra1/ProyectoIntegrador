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


        public async Task<IActionResult> Timbrar(string comprobante)
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
                        StrXml = comprobante
                    }
                };

                // Realiza la llamada al método TimbrarF
                var timbrarFResponse = await cliente.TimbrarFAsync("FIME", "s9%4ns7q#eGq", comprobante.ToString());
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



