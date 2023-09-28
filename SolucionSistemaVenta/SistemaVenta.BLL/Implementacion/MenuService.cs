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
    public class MenuService : IMenuService
    {
        private readonly IGenericRepository<Menu> _repositorioMenu;
        private readonly IGenericRepository<Usuario> _repositorioUsuario;
        private readonly IGenericRepository<RolMenu> _repositorioRolMenu;


        public MenuService(IGenericRepository<Menu> repositorioMenu,
                       IGenericRepository<Usuario> repositorioUsuario,
                                  IGenericRepository<RolMenu> repositorioRolMenu)
        {
            _repositorioMenu = repositorioMenu;
            _repositorioUsuario = repositorioUsuario;
            _repositorioRolMenu = repositorioRolMenu;
        }

        public async Task<List<Menu>> ObtenerMenu(int idUsuario)
        {
            IQueryable<Usuario> tbUsuario = await _repositorioUsuario.Consultar(u => u.IdUsuario == idUsuario);
            IQueryable<RolMenu> tbRolMenu = await _repositorioRolMenu.Consultar();
            IQueryable<Menu> tbMenu = await _repositorioMenu.Consultar();

            IQueryable<Menu> MenuPadre = (from u in tbUsuario
                                          join rm in tbRolMenu on u.IdRol equals rm.IdRol
                                          join m in tbMenu on rm.IdMenu equals m.IdMenu
                                          join mpadre in tbMenu on m.IdMenuPadre equals mpadre.IdMenu
                                          select mpadre).Distinct().AsQueryable();

            IQueryable<Menu> MenuHijos = (from u in tbUsuario
                                          join rm in tbRolMenu on u.IdRol equals rm.IdRol
                                          join m in tbMenu on rm.IdMenu equals m.IdMenu
                                          where m.IdMenu != m.IdMenuPadre
                                          select m).Distinct().AsQueryable();

            List<Menu> ListaMenu = (from mpadre in MenuPadre
                                    select new Menu()
                                    {
                                        IdMenu = mpadre.IdMenu,
                                        Descripcion = mpadre.Descripcion,
                                        Icono = mpadre.Icono,
                                        Controlador = mpadre.Controlador,
                                        PaginaAccion = mpadre.PaginaAccion,
                                        InverseIdMenuPadreNavigation = (from mhijo in MenuHijos
                                                                        where mhijo.IdMenuPadre == mpadre.IdMenu
                                                                        select mhijo).ToList()
                                    }).ToList();

            return ListaMenu;

        }
    }
}
