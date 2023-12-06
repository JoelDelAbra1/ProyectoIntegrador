using System;
using System.Collections.Generic;

namespace SistemaVenta.Entity;

public partial class Unidade
{
    public string CClaveUnidad { get; set; } = null!;

    public string? Nombre { get; set; }

    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
