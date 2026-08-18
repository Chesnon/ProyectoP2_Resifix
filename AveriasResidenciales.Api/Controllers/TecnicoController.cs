using AveriasResidenciales.Infrastructura.Interfaces.Repository;
using AveriasResidenciales.Infrastructura.Models;
using Microsoft.AspNetCore.Mvc;

namespace AveriasResidenciales.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TecnicoController(ITecnicoRepository _repo) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tecnico>>> GetAllTecnicos()
        {
            var tecnicos = await _repo.GetAll();
            return Ok(tecnicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tecnico>> GetTecnicoById(int id)
        {
            var tecnico = await _repo.GetById(id);
            if (tecnico == null)
            {
                return NotFound();
            }
            return Ok(tecnico);
        }

        [HttpPost]
        public async Task<ActionResult> AddTecnico(Tecnico tecnico)
        {
            await _repo.Add(tecnico);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTecnico(int id, Tecnico tecnico)
        {
            await _repo.Update(id, tecnico);
            if (tecnico == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTecnico(int id)
        {
            await _repo.Delete(id);
            return Ok();
        }
    }
}
