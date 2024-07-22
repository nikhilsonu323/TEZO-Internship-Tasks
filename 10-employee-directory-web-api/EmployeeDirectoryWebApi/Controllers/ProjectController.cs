using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace EmployeeDirectoryWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectRepo _projectRepo;

        public ProjectController(IProjectRepo locationRepo)
        {
            _projectRepo = locationRepo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _projectRepo.Get());
        }

        [HttpPost]
        public IActionResult Add(Project project)
        {
            _projectRepo.Add(project);
            return Created();
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var isDeleted = _projectRepo.Remove(id);
            return isDeleted ? Ok() : NotFound();
        }
    }
}
