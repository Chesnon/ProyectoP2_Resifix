using AveriasResidenciales.Application.Dtos.DtoResidente;
using AveriasResidenciales.Application.Interfaces.Repository;
using AveriasResidenciales.Application.Interfaces.Service;
using AveriasResidenciales.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Application.Services
{
    public class ResidenteServices(IResidenteRepository _repo) : IResidenteServices
    {
        public async Task Add(CreateResidenteDto residente)
        {
            var nResidente = new Residente
            {
                Nombre = residente.Nombre,
                Apellido = residente.Apellido,
                Telefono = residente.Telefono,
                Email = residente.Email,
                Apartamento = residente.Apartamento,
                FechaRegistro = residente.FechaRegistro,
                Activo = true
            };
            await _repo.Add(nResidente);
        }

        public async Task Delete(int id)
        {
            await _repo.Delete(id);
        }

        public async Task<IEnumerable<ReadResidenteDto>> GetAll()
        {
            var residentes = await _repo.GetAll();
            return residentes.Select(r => new ReadResidenteDto
            {
                id = r.id,
                Nombre = r.Nombre,
                Apellido = r.Apellido,
                Telefono = r.Telefono,
                Email = r.Email,
                Apartamento = r.Apartamento,
                Activo = r.Activo
            });
        }

        public async Task<ReadResidenteDto> GetById(int id)
        {
            var residente = await _repo.GetById(id);
            if (residente == null)
            {
                return null;
            }
            return new ReadResidenteDto
            {
                id = residente.id,
                Nombre = residente.Nombre,
                Apellido = residente.Apellido,
                Telefono = residente.Telefono,
                Email = residente.Email,
                Apartamento = residente.Apartamento,
                Activo = residente.Activo
            };
        }

        public async Task Update(int id, CreateResidenteDto residente)
        {
            var nResidente = new Residente
            {
                Nombre = residente.Nombre,
                Apellido = residente.Apellido,
                Telefono = residente.Telefono,
                Email = residente.Email,
                Apartamento = residente.Apartamento,
                FechaRegistro = residente.FechaRegistro
            };

            await _repo.Update(id, nResidente);
        }
    }
}
