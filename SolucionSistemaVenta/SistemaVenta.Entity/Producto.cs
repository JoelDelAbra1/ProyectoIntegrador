using System;
using System.Collections.Generic;

namespace SistemaVenta.Entity;

public partial class Producto
{
    public int IdProducto { get; set; }

    public string? CodigoBarra { get; set; }

    public string? Marca { get; set; }

    public string? Descripcion { get; set; }

    public int? IdCategoria { get; set; }

    public int? Stock { get; set; }

    public string? UrlImagen { get; set; }

    public string? NombreImagen { get; set; }

    public decimal? Precio { get; set; }

    public bool? EsActivo { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public string? Unidad { get; set; }

    public int? ProductoServicio { get; set; }

    public string? Impuestos { get; set; }

    public decimal? ValorImpuesto { get; set; }

    public string? TipoImpuesto { get; set; }

    public decimal? Descuento { get; set; }

    public virtual Categoria? IdCategoriaNavigation { get; set; }

    public virtual ProductoServicio? ProductoServicioNavigation { get; set; }

    public virtual Unidades? UnidadNavigation { get; set; }
}
