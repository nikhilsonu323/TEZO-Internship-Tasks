using EmployeeDirectory.Concerns;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace EmployeeDirectoryWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepo _departmentRepo;

        public DepartmentController(IDepartmentRepo departmentRepo)
        {
            _departmentRepo = departmentRepo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _departmentRepo.Get());
        }

        [HttpPost()]
        public IActionResult Add(Department department)
        {
            _departmentRepo.Add(department);
            return Created();
        }

        [HttpPost("filtered")]
        public async Task<IActionResult> GetFilteredDepartments(FilteringData filteringData)
        {
            return Ok(await _departmentRepo.GetFiltered(filteringData.StatusIds, filteringData.LocationIds));
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var isDeleted = _departmentRepo.Remove(id);
            return isDeleted ? Ok() : NotFound();
        }
    }
}
