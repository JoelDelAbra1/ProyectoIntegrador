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
    public class RegimenFiscalController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IRegimenFiscalService _regimenFiscalService;
        public RegimenFiscalController(IMapper mapper, IRegimenFiscalService regimenFiscalService) {
            _mapper = mapper;
            _regimenFiscalService = regimenFiscalService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<VMRegimenFiscal> vmRegimenFiscalLista = _mapper.Map<List<VMRegimenFiscal>>(await _regimenFiscalService.Lista());
            return StatusCode(StatusCodes.Status200OK, new { data = vmRegimenFiscalLista });
        }
    }
}
