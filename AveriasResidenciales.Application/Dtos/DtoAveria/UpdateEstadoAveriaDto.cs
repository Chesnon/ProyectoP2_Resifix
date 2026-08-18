using AveriasResidenciales.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Dtos.DtoAveria
{
    public class UpdateEstadoAveriaDto
    {
        public EstadoAveria Estado { get; set; }

        public int? TecnicoId { get; set; }
    }
}
