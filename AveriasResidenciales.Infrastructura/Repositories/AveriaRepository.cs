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
    public class AveriaRepository : IAveriaRepository
    {
        private readonly AveriasDbContext _db;

        public AveriaRepository(AveriasDbContext db)
        {
            _db = db;
        }

        public async Task Add(Averia averia)
        {
            var nAveria = new Averia
            {
                Titulo = averia.Titulo,
                Descripcion = averia.Descripcion,
                AreaComun = averia.AreaComun,
                Prioridad = averia.Prioridad,
                Estado = averia.Estado,
                FotoUrl = averia.FotoUrl,
                ResidenteId = averia.ResidenteId,
                TecnicoId = averia.TecnicoId,
                FechaReporte = averia.FechaReporte,
                FechaResolucion = averia.FechaResolucion
            };
            await _db.Averias.AddAsync(nAveria);
            await _db.SaveChangesAsync();
            return;
        }

        public async Task Delete(int id)
        {
            var averia = await _db.Averias.FindAsync(id);
            if (averia != null)
            {
                _db.Averias.Remove(averia);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Averia>> GetAll()
        {
            return await _db.Averias.AsNoTracking().ToListAsync();
        }

        public async Task<Averia> GetById(int id)
        {
            var averia = await _db.Averias.FirstOrDefaultAsync(a => a.Id == id);
            return averia;
        }

        public async Task Update(int id, Averia averia)
        {
            var nAveria = await _db.Averias.FirstOrDefaultAsync(a => a.Id == id);
            if (nAveria != null)
            {
                nAveria.Titulo = averia.Titulo;
                nAveria.Descripcion = averia.Descripcion;
                nAveria.AreaComun = averia.AreaComun;
                nAveria.Prioridad = averia.Prioridad;
                nAveria.Estado = averia.Estado;
                nAveria.FotoUrl = averia.FotoUrl;
                nAveria.ResidenteId = averia.ResidenteId;
                nAveria.TecnicoId = averia.TecnicoId;
                nAveria.FechaResolucion = averia.FechaResolucion;

                await _db.SaveChangesAsync();
            }
        }
    }
}
