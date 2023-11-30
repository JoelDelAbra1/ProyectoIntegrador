using System;
using System.Collections.Generic;

namespace SistemaVenta.Entity;

public partial class Cliente
{
    public int IdCliene { get; set; }

    public string NomRaz { get; set; } = null!;

    public string Correo { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Regimen { get; set; } = null!;

    public string Rfc { get; set; } = null!;

    public string CodigoPostal { get; set; } = null!;
}
