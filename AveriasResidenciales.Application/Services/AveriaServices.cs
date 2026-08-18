using AveriasResidenciales.Application.Dtos.DtoAveria;
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
    public class AveriaServices(IAveriaRepository _repo) : IAveriaServices
    {
        public async Task Add(CreateAveriaDto averia)
        {
            var nAveria = new Averia
            {
                Titulo = averia.Titulo,
                Descripcion = averia.Descripcion,
                AreaComun = averia.AreaComun,
                Prioridad = averia.Prioridad,
                FotoUrl = averia.FotoUrl,
                ResidenteId = averia.ResidenteId,
                Estado = Domain.Enums.EstadoAveria.Reportada,
                FechaReporte = DateTime.UtcNow
            };
            await _repo.Add(nAveria);
        }

        public async Task Delete(int id)
        {
            await _repo.Delete(id);
        }

        public async Task<IEnumerable<ReadAveriaDto>> GetAll()
        {
            var averias = await _repo.GetAll();
            return averias.Select(a => new ReadAveriaDto
            {
                id = a.Id,
                Titulo = a.Titulo,
                Descripcion = a.Descripcion,
                AreaComun = a.AreaComun,
                Prioridad = a.Prioridad,
                Estado = a.Estado,
                FotoUrl = a.FotoUrl,
                ResidenteId = a.ResidenteId,
                TecnicoId = a.TecnicoId,
                FechaReporte = a.FechaReporte,
                FechaResolucion = a.FechaResolucion
            });
        }

        public async Task<ReadAveriaDto> GetById(int id)
        {
            var averia = await _repo.GetById(id);
            if (averia == null)
            {
                return null;
            }
            return new ReadAveriaDto
            {
                id = averia.Id,
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
        }

        public async Task Update(int id, CreateAveriaDto averia)
        {
            var nAveria = new Averia
            {
                Titulo = averia.Titulo,
                Descripcion = averia.Descripcion,
                AreaComun = averia.AreaComun,
                Prioridad = averia.Prioridad,
                FotoUrl = averia.FotoUrl,
                ResidenteId = averia.ResidenteId
            };

            await _repo.Update(id, nAveria);
        }

        public async Task UpdateEstado(int id, UpdateEstadoAveriaDto estado)
        {
            var averia = await _repo.GetById(id);
            if (averia == null)
            {
                return;
            }

            averia.Estado = estado.Estado;
            if (estado.TecnicoId.HasValue)
            {
                averia.TecnicoId = estado.TecnicoId;
            }
            if (estado.Estado == Domain.Enums.EstadoAveria.Resuelta || estado.Estado == Domain.Enums.EstadoAveria.Cerrada)
            {
                averia.FechaResolucion = DateTime.UtcNow;
            }

            await _repo.Update(id, averia);
        }
    }
}
