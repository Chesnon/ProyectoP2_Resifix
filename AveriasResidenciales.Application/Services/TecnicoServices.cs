using AveriasResidenciales.Application.Dtos.DtoTecnico;
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
    public class TecnicoServices(ITecnicoRepository _repo) : ITecnicoServices
    {
        public async Task Add(CreateTecnicoDto tecnico)
        {
            var nTecnico = new Tecnico
            {
                Nombre = tecnico.Nombre,
                Apellido = tecnico.Apellido,
                Telefono = tecnico.Telefono,
                Email = tecnico.Email,
                Especialidad = tecnico.Especialidad,
                Disponible = true
            };
            await _repo.Add(nTecnico);
        }

        public async Task Delete(int id)
        {
            await _repo.Delete(id);
        }

        public async Task<IEnumerable<ReadTecnicoDto>> GetAll()
        {
            var tecnicos = await _repo.GetAll();
            return tecnicos.Select(t => new ReadTecnicoDto
            {
                id = t.id,
                Nombre = t.Nombre,
                Apellido = t.Apellido,
                Telefono = t.Telefono,
                Email = t.Email,
                Especialidad = t.Especialidad,
                Disponible = t.Disponible
            });
        }

        public async Task<ReadTecnicoDto> GetById(int id)
        {
            var tecnico = await _repo.GetById(id);
            if (tecnico == null)
            {
                return null;
            }
            return new ReadTecnicoDto
            {
                id = tecnico.id,
                Nombre = tecnico.Nombre,
                Apellido = tecnico.Apellido,
                Telefono = tecnico.Telefono,
                Email = tecnico.Email,
                Especialidad = tecnico.Especialidad,
                Disponible = tecnico.Disponible
            };
        }

        public async Task Update(int id, CreateTecnicoDto tecnico)
        {
            var nTecnico = new Tecnico
            {
                Nombre = tecnico.Nombre,
                Apellido = tecnico.Apellido,
                Telefono = tecnico.Telefono,
                Email = tecnico.Email,
                Especialidad = tecnico.Especialidad
            };

            await _repo.Update(id, nTecnico);
        }
    }
}
