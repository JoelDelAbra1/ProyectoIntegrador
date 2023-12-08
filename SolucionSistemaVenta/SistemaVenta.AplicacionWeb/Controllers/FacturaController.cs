using Microsoft.AspNetCore.Mvc;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    public class FacturaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
