using System;
using System.Collections.Generic;

namespace SistemaVenta.Entity;

public partial class RegimenFiscal
{
    public string CRegimenFiscal { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
}
