using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Interfaces.Repository
{
    public interface ITecnicoRepository
    {
        public Task<IEnumerable<Tecnico>> GetAll();

        public Task Add(Tecnico tecnico);

        public Task Update(int id, Tecnico tecnico);

        public Task Delete(int id);
        public Task<Tecnico> GetById(int id);
    }
}
