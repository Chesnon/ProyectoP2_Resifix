using AveriasResidenciales.Application.Dtos.DtoTecnico;
using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Interfaces.Service
{
    public interface ITecnicoServices
    {
        public Task<IEnumerable<ReadTecnicoDto>> GetAll();

        public Task Add(CreateTecnicoDto tecnico);

        public Task Update(int id, CreateTecnicoDto tecnico);

        public Task Delete(int id);
        public Task<ReadTecnicoDto> GetById(int id);
    }
}
