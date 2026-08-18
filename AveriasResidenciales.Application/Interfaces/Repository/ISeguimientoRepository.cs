using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Interfaces.Repository
{
    public interface ISeguimientoRepository
    {
        public Task<IEnumerable<Seguimiento>> GetAll();

        public Task Add(Seguimiento seguimiento);

        public Task Update(int id, Seguimiento seguimiento);

        public Task Delete(int id);
        public Task<Seguimiento> GetById(int id);

        public Task<IEnumerable<Seguimiento>> GetByAveriaId(int averiaId);
    }
}
