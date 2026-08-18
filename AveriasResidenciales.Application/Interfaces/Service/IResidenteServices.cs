using AveriasResidenciales.Application.Dtos.DtoResidente;
using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Interfaces.Service
{
    public interface IResidenteServices
    {
        public Task<IEnumerable<ReadResidenteDto>> GetAll();

        public Task Add(CreateResidenteDto residente);

        public Task Update(int id, CreateResidenteDto residente);

        public Task Delete(int id);
        public Task<ReadResidenteDto> GetById(int id);
    }
}
