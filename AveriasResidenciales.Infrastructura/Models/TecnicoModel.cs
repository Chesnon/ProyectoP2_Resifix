using AveriasResidenciales.Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Models
{
    public class Tecnico : BasePersona
    {
        public string Especialidad { get; set; } = string.Empty;

        public bool Disponible { get; set; }
    }
}
