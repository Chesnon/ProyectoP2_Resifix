using AveriasResidenciales.Domain.Core;
using AveriasResidenciales.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Models
{
    public class Averia : BaseEntity
    {
        public string Titulo { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public string AreaComun { get; set; } = string.Empty;

        public PrioridadAveria Prioridad { get; set; }

        public EstadoAveria Estado { get; set; }

        public string? FotoUrl { get; set; }

        public int ResidenteId { get; set; }

        public int? TecnicoId { get; set; }

        public DateTime FechaReporte { get; set; }

        public DateTime? FechaResolucion { get; set; }
    }
}
