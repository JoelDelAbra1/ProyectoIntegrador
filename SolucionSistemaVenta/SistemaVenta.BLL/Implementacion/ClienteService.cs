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
    public class ClienteService : IClienteService
    {
        private readonly IGenericRepository<Cliente> _repositorio;

        public ClienteService(IGenericRepository<Cliente> repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<Cliente>> Lista()
                {
            IQueryable<Cliente> query = await _repositorio.Consultar();
            return query.ToList();
                }

        public async Task<Cliente> Crear(Cliente cliente)
        {
            try
            {
                Cliente cliente_creado = await _repositorio.Crear(cliente);
                if (cliente_creado.IdCliene == 0)
                    throw new TaskCanceledException("No se pudo crear el cliente");

                return cliente_creado;
            }
            catch
            {
                throw;
            }

        }

        public async Task<Cliente> Editar(Cliente cliene)
        {

           try
            {
                IQueryable<Cliente> query = await _repositorio.Consultar(c => c.IdCliene == cliene.IdCliene);

                Cliente cliente_encontrado = query.FirstOrDefault();

                cliente_encontrado.NomRaz = cliene.NomRaz;
                cliente_encontrado.Correo = cliene.Correo;
                cliente_encontrado.Regimen = cliene.Regimen;
                cliente_encontrado.Telefono = cliene.Telefono;
                cliente_encontrado.Rfc = cliene.Rfc;
                cliente_encontrado.CodigoPostal = cliene.CodigoPostal;

    

                bool respuesta = await _repositorio.Editar(cliente_encontrado);

                if(!respuesta)
                    throw new TaskCanceledException("No se pudo modificar el cliente");
               return cliente_encontrado;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int idCliente)
        {
            try
            {
                Cliente cliente_encontrado = await _repositorio.Obtener(c => c.IdCliene == idCliente);
                if(cliente_encontrado == null)
                    throw new TaskCanceledException("No se pudo encontrar el cliente");

                bool respueta = await _repositorio.Eliminar(cliente_encontrado);
                return respueta;

            }
            catch
            {
                throw;
            }
        }

        
    }
}
