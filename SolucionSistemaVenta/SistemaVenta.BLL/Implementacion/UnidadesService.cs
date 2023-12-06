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
    public class UnidadesService : IUnidadesService

    {
        private readonly IGenericRepository<Unidades> _repositorio;

        public UnidadesService(IGenericRepository<Unidades> repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<Unidades>> Lista()
        {
            IQueryable<Unidades> query = await _repositorio.Consultar();
            return query.ToList();
        }
    }
   }

