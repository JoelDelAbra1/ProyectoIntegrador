
using SistemaVenta.Entity;

namespace SistemaVenta.AplicacionWeb.Models.ViewModels
{
    public class VMCliente
    {
        public int IdCliene { get; set; }
        public string NomRaz { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public string Regimen { get; set; }
        public string Rfc { get; set; }
        public string CodigoPostal { get; set; }
    }
}
