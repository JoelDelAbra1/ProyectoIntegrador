namespace SistemaVenta.AplicacionWeb.Utilidades.Response
{
    public class GenericResponse<TObject>
    {
        public bool Estaado { get; set; }

        public string? Mensaje { get; set; } // ? perimite nulos

        public TObject? Object { get; set; }

        public List<TObject>? ListaObjecto{ get; set; }
    }
}
