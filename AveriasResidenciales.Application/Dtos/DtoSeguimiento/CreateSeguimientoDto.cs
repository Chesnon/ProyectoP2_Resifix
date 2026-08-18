using AveriasResidenciales.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Dtos.DtoSeguimiento
{
    public class CreateSeguimientoDto
    {
        public int AveriaId { get; set; }

        public int TecnicoId { get; set; }

        public string Comentario { get; set; }

        public EstadoAveria EstadoAnterior { get; set; }

        public EstadoAveria EstadoNuevo { get; set; }
    }
}
