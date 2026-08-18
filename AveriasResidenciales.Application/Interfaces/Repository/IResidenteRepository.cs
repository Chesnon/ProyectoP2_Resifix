using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Interfaces.Repository
{
    public interface IResidenteRepository
    {
        public Task<IEnumerable<Residente>> GetAll();

        public Task Add(Residente residente);

        public Task Update(int id, Residente residente);

        public Task Delete(int id);
        public Task<Residente> GetById(int id);
    }
}
