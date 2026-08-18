using AveriasResidenciales.Infrastructura.Interfaces.Repository;
using AveriasResidenciales.Infrastructura.Models;
using Microsoft.AspNetCore.Mvc;

namespace AveriasResidenciales.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeguimientoController(ISeguimientoRepository _repo) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Seguimiento>>> GetAllSeguimientos()
        {
            var seguimientos = await _repo.GetAll();
            return Ok(seguimientos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Seguimiento>> GetSeguimientoById(int id)
        {
            var seguimiento = await _repo.GetById(id);
            if (seguimiento == null)
            {
                return NotFound();
            }
            return Ok(seguimiento);
        }

        [HttpGet("porAveria/{averiaId}")]
        public async Task<ActionResult<IEnumerable<Seguimiento>>> GetByAveriaId(int averiaId)
        {
            var seguimientos = await _repo.GetByAveriaId(averiaId);
            return Ok(seguimientos);
        }

        [HttpPost]
        public async Task<ActionResult> AddSeguimiento(Seguimiento seguimiento)
        {
            await _repo.Add(seguimiento);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSeguimiento(int id, Seguimiento seguimiento)
        {
            await _repo.Update(id, seguimiento);
            if (seguimiento == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSeguimiento(int id)
        {
            await _repo.Delete(id);
            return Ok();
        }
    }
}
