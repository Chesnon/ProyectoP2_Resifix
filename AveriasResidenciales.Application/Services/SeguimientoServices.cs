using AveriasResidenciales.Application.Dtos.DtoSeguimiento;
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
    public class SeguimientoServices(ISeguimientoRepository _repo) : ISeguimientoServices
    {
        public async Task Add(CreateSeguimientoDto seguimiento)
        {
            var nSeguimiento = new Seguimiento
            {
                AveriaId = seguimiento.AveriaId,
                TecnicoId = seguimiento.TecnicoId,
                Comentario = seguimiento.Comentario,
                EstadoAnterior = seguimiento.EstadoAnterior,
                EstadoNuevo = seguimiento.EstadoNuevo,
                Fecha = DateTime.UtcNow
            };
            await _repo.Add(nSeguimiento);
        }

        public async Task Delete(int id)
        {
            await _repo.Delete(id);
        }

        public async Task<IEnumerable<ReadSeguimientoDto>> GetAll()
        {
            var seguimientos = await _repo.GetAll();
            return seguimientos.Select(s => new ReadSeguimientoDto
            {
                id = s.Id,
                AveriaId = s.AveriaId,
                TecnicoId = s.TecnicoId,
                Comentario = s.Comentario,
                EstadoAnterior = s.EstadoAnterior,
                EstadoNuevo = s.EstadoNuevo,
                Fecha = s.Fecha
            });
        }

        public async Task<IEnumerable<ReadSeguimientoDto>> GetByAveriaId(int averiaId)
        {
            var seguimientos = await _repo.GetByAveriaId(averiaId);
            return seguimientos.Select(s => new ReadSeguimientoDto
            {
                id = s.Id,
                AveriaId = s.AveriaId,
                TecnicoId = s.TecnicoId,
                Comentario = s.Comentario,
                EstadoAnterior = s.EstadoAnterior,
                EstadoNuevo = s.EstadoNuevo,
                Fecha = s.Fecha
            });
        }

        public async Task<ReadSeguimientoDto> GetById(int id)
        {
            var seguimiento = await _repo.GetById(id);
            if (seguimiento == null)
            {
                return null;
            }
            return new ReadSeguimientoDto
            {
                id = seguimiento.Id,
                AveriaId = seguimiento.AveriaId,
                TecnicoId = seguimiento.TecnicoId,
                Comentario = seguimiento.Comentario,
                EstadoAnterior = seguimiento.EstadoAnterior,
                EstadoNuevo = seguimiento.EstadoNuevo,
                Fecha = seguimiento.Fecha
            };
        }

        public async Task Update(int id, CreateSeguimientoDto seguimiento)
        {
            var nSeguimiento = new Seguimiento
            {
                AveriaId = seguimiento.AveriaId,
                TecnicoId = seguimiento.TecnicoId,
                Comentario = seguimiento.Comentario,
                EstadoAnterior = seguimiento.EstadoAnterior,
                EstadoNuevo = seguimiento.EstadoNuevo
            };

            await _repo.Update(id, nSeguimiento);
        }
    }
}
