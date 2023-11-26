using System;
using System.Collections.Generic;

namespace SistemaVenta.Entity;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string? NomRaz { get; set; }

    public string? Correo { get; set; }

    public string? Telefono { get; set; }

    public string? Regimen { get; set; }

    public string? RFC { get; set; }

    public string? CodigoPostal { get; set; }

   
}
