using SistemaVenta.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DAL.Interfaces
{
    public interface IVentaRepository
    {
        Task<IQueryable<Venta>> Consultar(Func<object, bool> value);
        Task<Venta> Registrar(Venta entidad);
        Task<List<DetalleVenta>>Reporte(DateTime FechaInicio, DateTime FechaFin);
    }
}
