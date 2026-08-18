using AveriasResidenciales.Infrastructura.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Interfaces.Repository
{
    public interface IAveriaRepository
    {
        public Task<IEnumerable<Averia>> GetAll();

        public Task Add(Averia averia);

        public Task Update(int id, Averia averia);

        public Task Delete(int id);
        public Task<Averia> GetById(int id);
    }
}
