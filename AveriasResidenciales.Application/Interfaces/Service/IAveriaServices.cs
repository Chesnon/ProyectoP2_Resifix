using AveriasResidenciales.Application.Dtos.DtoAveria;
using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Interfaces.Service
{
    public interface IAveriaServices
    {
        public Task<IEnumerable<ReadAveriaDto>> GetAll();

        public Task Add(CreateAveriaDto averia);

        public Task Update(int id, CreateAveriaDto averia);

        public Task UpdateEstado(int id, UpdateEstadoAveriaDto estado);

        public Task Delete(int id);
        public Task<ReadAveriaDto> GetById(int id);
    }
}
