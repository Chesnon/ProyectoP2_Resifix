using AveriasResidenciales.Infrastructura.Interfaces.Repository;
using AveriasResidenciales.Infrastructura.Models;
using Microsoft.AspNetCore.Mvc;

namespace AveriasResidenciales.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResidenteController(IResidenteRepository _repo) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Residente>>> GetAllResidentes()
        {
            var residentes = await _repo.GetAll();
            return Ok(residentes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Residente>> GetResidenteById(int id)
        {
            var residente = await _repo.GetById(id);
            if (residente == null)
            {
                return NotFound();
            }
            return Ok(residente);
        }

        [HttpPost]
        public async Task<ActionResult> AddResidente(Residente residente)
        {
            await _repo.Add(residente);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateResidente(int id, Residente residente)
        {
            await _repo.Update(id, residente);
            if (residente == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteResidente(int id)
        {
            await _repo.Delete(id);
            return Ok();
        }
    }
}
