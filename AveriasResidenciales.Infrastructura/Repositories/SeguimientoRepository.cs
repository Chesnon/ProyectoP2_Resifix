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
    public class SeguimientoRepository : ISeguimientoRepository
    {
        private readonly AveriasDbContext _db;

        public SeguimientoRepository(AveriasDbContext db)
        {
            _db = db;
        }

        public async Task Add(Seguimiento seguimiento)
        {
            var nSeguimiento = new Seguimiento
            {
                AveriaId = seguimiento.AveriaId,
                TecnicoId = seguimiento.TecnicoId,
                Comentario = seguimiento.Comentario,
                EstadoAnterior = seguimiento.EstadoAnterior,
                EstadoNuevo = seguimiento.EstadoNuevo,
                Fecha = seguimiento.Fecha
            };
            await _db.Seguimientos.AddAsync(nSeguimiento);
            await _db.SaveChangesAsync();
            return;
        }

        public async Task Delete(int id)
        {
            var seguimiento = await _db.Seguimientos.FindAsync(id);
            if (seguimiento != null)
            {
                _db.Seguimientos.Remove(seguimiento);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Seguimiento>> GetAll()
        {
            return await _db.Seguimientos.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<Seguimiento>> GetByAveriaId(int averiaId)
        {
            return await _db.Seguimientos.AsNoTracking()
                .Where(s => s.AveriaId == averiaId)
                .OrderBy(s => s.Fecha)
                .ToListAsync();
        }

        public async Task<Seguimiento> GetById(int id)
        {
            var seguimiento = await _db.Seguimientos.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            return seguimiento;
        }

        public async Task Update(int id, Seguimiento seguimiento)
        {
            var nSeguimiento = await _db.Seguimientos.FirstOrDefaultAsync(s => s.Id == id);
            if (nSeguimiento != null)
            {
                nSeguimiento.Comentario = seguimiento.Comentario;
                nSeguimiento.EstadoAnterior = seguimiento.EstadoAnterior;
                nSeguimiento.EstadoNuevo = seguimiento.EstadoNuevo;

                await _db.SaveChangesAsync();
            }
        }
    }
}
