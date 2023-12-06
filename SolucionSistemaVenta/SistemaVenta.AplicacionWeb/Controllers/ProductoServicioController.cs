using Microsoft.AspNetCore.Mvc;

using AutoMapper;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using SistemaVenta.AplicacionWeb.Utilidades.Response;
using SistemaVenta.BLL.Interfaces;
using SistemaVenta.Entity;
using Microsoft.AspNetCore.Authorization;
using SistemaVenta.BLL.Implementacion;

namespace SistemaVenta.AplicacionWeb.Controllers
{

    [Authorize]
    public class ProductoServicioController : Controller
    {

        private readonly IMapper _mapper;
        private readonly IProductoServicioService _productoServicioService;

        public ProductoServicioController(IMapper mapper, IProductoServicioService productoServicioService)
        {
            _mapper = mapper;
            _productoServicioService = productoServicioService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<VMProductoServicio> vmProductoServicioLista = _mapper.Map<List<VMProductoServicio>>(await _productoServicioService.Lista());
            return StatusCode(StatusCodes.Status200OK, new { data = vmProductoServicioLista });
        }
    }
}
