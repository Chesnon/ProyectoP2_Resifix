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
    public class ResidenteRepository : IResidenteRepository
    {
        private readonly AveriasDbContext _db;

        public ResidenteRepository(AveriasDbContext db)
        {
            _db = db;
        }

        public async Task Add(Residente residente)
        {
            var nResidente = new Residente
            {
                Nombre = residente.Nombre,
                Apellido = residente.Apellido,
                Telefono = residente.Telefono,
                Email = residente.Email,
                Apartamento = residente.Apartamento,
                FechaRegistro = residente.FechaRegistro,
                Activo = residente.Activo
            };
            await _db.Residentes.AddAsync(nResidente);
            await _db.SaveChangesAsync();
            return;
        }

        public async Task Delete(int id)
        {
            var residente = await _db.Residentes.FindAsync(id);
            if (residente != null)
            {
                _db.Residentes.Remove(residente);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Residente>> GetAll()
        {
            return await _db.Residentes.AsNoTracking().ToListAsync();
        }

        public async Task<Residente> GetById(int id)
        {
            var residente = await _db.Residentes.AsNoTracking().FirstOrDefaultAsync(r => r.id == id);
            return residente;
        }

        public async Task Update(int id, Residente residente)
        {
            var nResidente = await _db.Residentes.FirstOrDefaultAsync(r => r.id == id);
            if (nResidente != null)
            {
                nResidente.Nombre = residente.Nombre;
                nResidente.Apellido = residente.Apellido;
                nResidente.Telefono = residente.Telefono;
                nResidente.Email = residente.Email;
                nResidente.Apartamento = residente.Apartamento;
                nResidente.FechaRegistro = residente.FechaRegistro;

                await _db.SaveChangesAsync();
            }
        }
    }
}
