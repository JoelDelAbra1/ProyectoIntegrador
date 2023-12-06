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
    public class UnidadesController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IUnidadesService _unidadesService;
        public UnidadesController(IMapper mapper, IUnidadesService unidadesService)
        {
            _mapper = mapper;
            _unidadesService = unidadesService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<VMUnidades> vmUnidadesLista = _mapper.Map<List<VMUnidades>>(await _unidadesService.Lista());
            return StatusCode(StatusCodes.Status200OK, new { data = vmUnidadesLista });
        }
    }
}
