using AveriasResidenciales.Infrastructura.Interfaces.Repository;
using AveriasResidenciales.Infrastructura.Context;
using AveriasResidenciales.Infrastructura.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Repositories
{
    public class TecnicoRepository : ITecnicoRepository
    {
        private readonly AveriasDbContext _db;

        public TecnicoRepository(AveriasDbContext db)
        {
            _db = db;
        }

        public async Task Add(Tecnico tecnico)
        {
            var nTecnico = new Tecnico
            {
                Nombre = tecnico.Nombre,
                Apellido = tecnico.Apellido,
                Telefono = tecnico.Telefono,
                Email = tecnico.Email,
                Especialidad = tecnico.Especialidad,
                Disponible = tecnico.Disponible
            };
            await _db.Tecnicos.AddAsync(nTecnico);
            await _db.SaveChangesAsync();
            return;
        }

        public async Task Delete(int id)
        {
            var tecnico = await _db.Tecnicos.FindAsync(id);
            if (tecnico != null)
            {
                _db.Tecnicos.Remove(tecnico);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Tecnico>> GetAll()
        {
            return await _db.Tecnicos.AsNoTracking().ToListAsync();
        }

        public async Task<Tecnico> GetById(int id)
        {
            var tecnico = await _db.Tecnicos.AsNoTracking().FirstOrDefaultAsync(t => t.id == id);
            return tecnico;
        }

        public async Task Update(int id, Tecnico tecnico)
        {
            var nTecnico = await _db.Tecnicos.FirstOrDefaultAsync(t => t.id == id);
            if (nTecnico != null)
            {
                nTecnico.Nombre = tecnico.Nombre;
                nTecnico.Apellido = tecnico.Apellido;
                nTecnico.Telefono = tecnico.Telefono;
                nTecnico.Email = tecnico.Email;
                nTecnico.Especialidad = tecnico.Especialidad;
                nTecnico.Disponible = tecnico.Disponible;

                await _db.SaveChangesAsync();
            }
        }
    }
}
