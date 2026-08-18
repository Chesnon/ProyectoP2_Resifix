using AveriasResidenciales.Application.Dtos.DtoAveria;
using AveriasResidenciales.Infrastructura.Interfaces.Repository;
using AveriasResidenciales.Infrastructura.Models;
using Microsoft.AspNetCore.Mvc;

namespace AveriasResidenciales.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AveriaController(IAveriaRepository _repo) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Averia>>> GetAllAverias()
        {
            var averias = await _repo.GetAll();
            return Ok(averias);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Averia>> GetAveriaById(int id)
        {
            var averia = await _repo.GetById(id);
            if (averia == null)
            {
                return NotFound();
            }
            return Ok(averia);
        }

        [HttpPost]
        public async Task<ActionResult> AddAveria(Averia averia)
        {
            await _repo.Add(averia);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAveria(int id, Averia averia)
        {
            await _repo.Update(id, averia);
            if (averia == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpPatch("{id}/estado")]
        public async Task<ActionResult> UpdateEstadoAveria(int id, UpdateEstadoAveriaDto dto)
        {
            var averia = await _repo.GetById(id);
            if (averia == null)
            {
                return NotFound();
            }

            averia.Estado = dto.Estado;
            if (dto.TecnicoId.HasValue)
            {
                averia.TecnicoId = dto.TecnicoId;
            }
            if (dto.Estado == Domain.Enums.EstadoAveria.Resuelta || dto.Estado == Domain.Enums.EstadoAveria.Cerrada)
            {
                averia.FechaResolucion = DateTime.UtcNow;
            }

            await _repo.Update(id, averia);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAveria(int id)
        {
            await _repo.Delete(id);
            return Ok();
        }
    }
}
