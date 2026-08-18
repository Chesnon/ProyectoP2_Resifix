using AveriasResidenciales.Application.Dtos.DtoSeguimiento;
using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Interfaces.Service
{
    public interface ISeguimientoServices
    {
        public Task<IEnumerable<ReadSeguimientoDto>> GetAll();

        public Task Add(CreateSeguimientoDto seguimiento);

        public Task Update(int id, CreateSeguimientoDto seguimiento);

        public Task Delete(int id);
        public Task<ReadSeguimientoDto> GetById(int id);

        public Task<IEnumerable<ReadSeguimientoDto>> GetByAveriaId(int averiaId);
    }
}
