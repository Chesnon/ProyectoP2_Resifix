using AveriasResidenciales.Domain.Core;
using AveriasResidenciales.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Models
{
    public class Seguimiento : BaseEntity
    {
        public int AveriaId { get; set; }

        public int TecnicoId { get; set; }

        public string Comentario { get; set; } = string.Empty;

        public EstadoAveria EstadoAnterior { get; set; }

        public EstadoAveria EstadoNuevo { get; set; }

        public DateTime Fecha { get; set; }
    }
}
