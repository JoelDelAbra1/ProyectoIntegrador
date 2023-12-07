using System;
using System.Collections.Generic;

namespace SistemaVenta.Entity;

public partial class DetalleVenta
{
    public int IdDetalleVenta { get; set; }

    public int? IdVenta { get; set; }

    public int? IdProducto { get; set; }

    public string? MarcaProducto { get; set; }

    public string? DescripcionProducto { get; set; }

    public string? CategoriaProducto { get; set; }

    public int? Cantidad { get; set; }

    public decimal? Precio { get; set; }

    public decimal? Total { get; set; }

    public string? Unidad { get; set; }

    public int? ProductoServicio { get; set; }

    public string? Impuestos { get; set; }

    public decimal? ValorImpuesto { get; set; }

    public string? TipoImpuesto { get; set; }

    public decimal? Descuento { get; set; }

    public virtual Venta? IdVentaNavigation { get; set; }
}
