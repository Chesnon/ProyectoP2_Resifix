using AveriasResidenciales.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Dtos.DtoAveria
{
    public class CreateAveriaDto
    {
        public string Titulo { get; set; }

        public string Descripcion { get; set; }

        public string AreaComun { get; set; }

        public PrioridadAveria Prioridad { get; set; }

        public string? FotoUrl { get; set; }

        public int ResidenteId { get; set; }
    }
}
