namespace SistemaVenta.AplicacionWeb.Utilidades.Response
{
    public class GenericResponse<TObject>
    {
        public bool Estado { get; set; }

        public string? Mensaje { get; set; } // ? perimite nulos

        public TObject? Objeto { get; set; }

        public List<TObject>? ListaObjecto{ get; set; }
    }
}
