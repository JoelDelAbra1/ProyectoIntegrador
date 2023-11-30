using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.Entity;


namespace SistemaVenta.BLL.Interfaces
{
    public interface IClienteService
    {
        Task<List<Cliente>> Lista();
        Task<Cliente> Crear(Cliente cliente);
        Task<Cliente> Editar(Cliente cliente);

        Task<bool> Eliminar(int idCliente);
    }
}
