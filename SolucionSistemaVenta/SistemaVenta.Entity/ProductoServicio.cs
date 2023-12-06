using System;
using System.Collections.Generic;

namespace SistemaVenta.Entity;

public partial class ProductoServicio
{
    public int CClaveProdServ { get; set; }

    public string? Descripcion { get; set; }

    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
