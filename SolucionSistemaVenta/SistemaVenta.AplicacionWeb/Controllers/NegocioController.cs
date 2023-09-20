using Microsoft.AspNetCore.Mvc;


using AutoMapper;
using Newtonsoft.Json;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using SistemaVenta.AplicacionWeb.Utilidades.Response;
using SistemaVenta.BLL.Interfaces;
using SistemaVenta.Entity;



namespace SistemaVenta.AplicacionWeb.Controllers
{
    public class NegocioController : Controller
    {

        private readonly IMapper _mapper;
        private readonly INegocioService _negocioService;

        public NegocioController(IMapper mapper, INegocioService negocioService)
        {
            _mapper = mapper;
            _negocioService = negocioService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public  async Task<IActionResult> Obtener()
        {
            GenericResponse<VMNegocio> gResponse = new GenericResponse<VMNegocio>();
            try
            {
                VMNegocio vMNegocio = _mapper.Map<VMNegocio>(await _negocioService.Obtener());

                gResponse.Estado = true;
                gResponse.Object = vMNegocio; // object o objeto
            }
            catch(Exception ex)
            {
                gResponse.Estado = false;
                gResponse.Mensaje = ex.Message;
            }
            return StatusCode(StatusCodes.Status200OK, gResponse);
        }
    }
}
