using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.BLL.Interfaces
{
    public interface IFireBaseService
    {
        Task<string> SubirStorage(Stream StreamArchivo, string CarpetaaDestino, string NombreArchivo);
        Task<bool> EliminarStorage(string CarpetaaDestino, string NombreArchivo);
    }
}
