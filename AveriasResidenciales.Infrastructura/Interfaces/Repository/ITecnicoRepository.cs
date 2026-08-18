using AveriasResidenciales.Infrastructura.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Interfaces.Repository
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
