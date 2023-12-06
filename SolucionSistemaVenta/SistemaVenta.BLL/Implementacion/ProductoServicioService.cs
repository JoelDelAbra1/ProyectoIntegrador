
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.BLL.Interfaces;
using SistemaVenta.DAL.Interfaces;
using SistemaVenta.Entity;


namespace SistemaVenta.BLL.Implementacion
{
    public class ProductoServicioService : IProductoServicioService
    {
        private readonly IGenericRepository<ProductoServicio> _repositorio;

        public ProductoServicioService(IGenericRepository<ProductoServicio> repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<ProductoServicio>> Lista()
        {
            IQueryable<ProductoServicio> query = await _repositorio.Consultar();
            return query.ToList();
        }
    }
}
