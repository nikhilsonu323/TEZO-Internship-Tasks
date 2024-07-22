using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeServices _employeeService;
        public EmployeesController(IEmployeeServices employeeService)
        {
            _employeeService = employeeService;
        }


        [HttpGet]
        public IActionResult GetEmployeesData()
        {
            var employees = _employeeService.GetEmployees();
            return Ok(employees);
        }


        [HttpGet("{id}")]
        public IActionResult GetEmployeeById(string id)
        {
            var a = HttpContext.Request.Headers;
            var emp = _employeeService.GetEmployee(id);
            if (emp == null) { return Ok(); }
            return Ok(emp);
        }

        [HttpPost("")]
        public IActionResult AddEmployee([FromBody] EmployeeDTO employee)
        {
            if (!_employeeService.AddEmployee(employee))
            {
                ModelState.AddModelError("employeeId", "Employee Id already exists.");
                return BadRequest(ModelState);
            }
            return CreatedAtAction("GetEmployeeById", new { id = employee.EmpNo }, employee);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployeeById(string id)
        {
            var isDeleted = _employeeService.DeleteEmployee(id);
            if (isDeleted)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpDelete]
        public IActionResult DeleteEmployees([FromBody] List<string> ids)
        {
            var employeesNotFound = new List<string>();
            foreach (string id in ids)
            {
                var isDeleted = _employeeService.DeleteEmployee(id);
                if (!isDeleted)
                {
                    employeesNotFound.Add(id);
                }
            }
            return Ok(employeesNotFound);
        }

        [HttpPut("")]
        public IActionResult UpdateEmployee([FromBody] EmployeeDTO employee)
        {
            if (!_employeeService.UpdateEmployee(employee))
            {
                ModelState.AddModelError("employeeId", "Employee Id Not Found.");
                return BadRequest(ModelState);
            }
            return NoContent();
        }

        [HttpPost("filter")]
        public IActionResult FilterData([FromBody] EmployeeFilters filterData)
        {
            return Ok(_employeeService.GetFilterEmployees(filterData));
        }

        [HttpGet("managers")]
        public IActionResult EmployeesForManagers()
        {
            return Ok(_employeeService.GetManagers());
        }


        [HttpGet("role/{id}")]
        public IActionResult GetEmployeesInRole(int id)
        {
            return Ok(_employeeService.GetEmployeesInRole(id));
        }

/*        [HttpPost("image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile image)
        {
            var extension = Path.GetExtension(image.FileName);
            var filename = Path.GetFileName(image.FileName);
            if (extension != ".jpg" || extension != ".jpeg" || extension != ".png") return BadRequest(new {Format = "Incorrect Image Format"});
            Console.WriteLine(Directory.GetCurrentDirectory());

            var info = Directory.CreateDirectory("C:\\Projects\\EmployeeDirectoryWebApi\\Profiles").ToString();

            using (var stream = new FileStream(info + '\\' + image.FileName, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return Ok(new { name = image.FileName });
        }*/

    }
}
