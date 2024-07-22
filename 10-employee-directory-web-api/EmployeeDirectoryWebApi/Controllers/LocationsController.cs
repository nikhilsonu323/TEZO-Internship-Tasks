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
    public class LocationsController : ControllerBase
    {
        private readonly ILocationRepo _locationRepo;

        public LocationsController(ILocationRepo locationRepo)
        {
            _locationRepo = locationRepo;
        }

        [HttpGet]
        public async Task<IActionResult> Get() 
        {
            return Ok(await _locationRepo.Get());
        }

        [HttpPost]
        public IActionResult Add(Location location) 
        {
            _locationRepo.Add(location);
            return Created();
        }

        [HttpPost("filtered")]
        public async Task<IActionResult> GetFilteredLocations(FilteringData filteringData) 
        {
            return Ok(await _locationRepo.GetFiltered(filteringData.StatusIds, filteringData.DepartmentIds));
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var isDeleted = _locationRepo.Remove(id);
            return isDeleted ? Ok() : NotFound();
        }
    }
}
