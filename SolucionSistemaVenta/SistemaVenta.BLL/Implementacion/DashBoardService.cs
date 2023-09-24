﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Interfaces;
using SistemaVenta.DAL.Interfaces;
using SistemaVenta.Entity;
using System.Globalization;

namespace SistemaVenta.BLL.Implementacion
{
    public class DashBoardService : IDashBoardService
    {

        private readonly IVentaRepository _reposotorioVenta;
        private readonly IGenericRepository<DetalleVenta> _reposotorioDetalleVenta;
        private readonly IGenericRepository<Categoria> _reposotorioCategoria;
        private readonly IGenericRepository<Producto> _reposotorioProducto;

        private DateTime FechaInicio = DateTime.Now;

                public DashBoardService(IVentaRepository reposotorioVenta, 
                    IGenericRepository<DetalleVenta> reposotorioDetalleVenta, 
                    IGenericRepository<Categoria> reposotorioCategoria, 
                    IGenericRepository<Producto> reposotorioProducto)
        {
            _reposotorioVenta = reposotorioVenta;
            _reposotorioDetalleVenta = reposotorioDetalleVenta;
            _reposotorioCategoria = reposotorioCategoria;
            _reposotorioProducto = reposotorioProducto;

            FechaInicio = FechaInicio.AddDays(-7);
        }

        public async Task<int> TotalVentasUltimaSemana()
        {
            try
            {
                IQueryable<Venta> query = await _reposotorioVenta.Consultar(v => v.FechaRegistro.Value.Date >= FechaInicio.Date);
                int total = query.Count();
                return total;
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> TotalIngresosUltimaSemana()
        {
            try
            {
                IQueryable<Venta> query = await _reposotorioVenta.Consultar(v => v.FechaRegistro.Value.Date >= FechaInicio.Date);
                decimal resultado = query
                    .Select(v => v.Total)
                    .Sum(v => v.Value);

                return Convert.ToString(resultado, new CultureInfo("es-PE"));
            }
            catch
            {
                throw;
            }
        }

        public async Task<int> TotalProductos()
        {
            try
            {
                IQueryable<Producto> query = await _reposotorioProducto.Consultar();
                int total = query.Count();
                return total;
            }
            catch
            {
                throw;
            }
        }

        public async Task<int> TotalCategorias()
        {
            try
            {
                IQueryable<Categoria> query = await _reposotorioCategoria.Consultar();
                int total = query.Count();
                return total;
            }
            catch
            {
                throw;
            }
        }
        public async Task<Dictionary<string, int>> VentasUltimaSemana()
        {
            try
            {
                IQueryable<Venta> query = await _reposotorioVenta.Consultar(v=> v.FechaRegistro.Value.Date >= FechaInicio.Date);
                Dictionary<string, int> resultado = query
                    .GroupBy(v => v.FechaRegistro.Value.Date).OrderByDescending(g => g.Key)
                    .Select(dv => new {fecha = dv.Key.ToString("dd/MM/yyyy"), total = dv.Count() })
                    .ToDictionary(keySelector: r => r.fecha, elementSelector: r => r.total);

                return resultado;
                   
            }
            catch
            {
                throw;
            }
        }

        public async Task<Dictionary<string, int>> ProductosTopUltimaSemana()
        {
            try
            {
                IQueryable<DetalleVenta> query = await _reposotorioDetalleVenta.Consultar();

                Dictionary<string, int> resultado = query
                    .Include(v => v.IdVentaNavigation)
                    .Where(dv => dv.IdVentaNavigation.FechaRegistro.Value.Date >= FechaInicio.Date)
                    .GroupBy(dv => dv.DescripcionProducto).OrderByDescending(g => g.Count())
                    .Select(dv => new { producto = dv.Key, total = dv.Count() })
                    .ToDictionary(keySelector: r => r.producto, elementSelector: r => r.total);

                return resultado;

            }
            catch
            {
                throw;
            }
        }

      

        

       

       

       
    }
}