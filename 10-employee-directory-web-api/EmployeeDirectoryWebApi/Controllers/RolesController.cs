using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.DTO_s;
using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly IRoleServices _roleServices;
        private readonly IEmployeeServices _employeeServices;

        public RolesController(IRoleServices roleServices, IEmployeeServices employeeServices)
        {
            _roleServices = roleServices;
            _employeeServices = employeeServices;
        }

        [HttpPost("")]
        public IActionResult Add(AddRole role)
        {
            int roleId = _roleServices.AddRole(role);
            _employeeServices.UpdateEmployeesRole(role.EmployeeIds, roleId);
            return Created();
        }

        [HttpGet("{id}")]
        public IActionResult GetRoleById(int id)
        {
            var role = _roleServices.GetRole(id);
            if (role == null) { return NotFound(); }
            return Ok(role);
        }

        [HttpGet("")]
        public IActionResult GetRoles()
        {
            var roles = _roleServices.GetRoles();
            return Ok(roles);
        }

        [HttpPut("{id}")]
        public IActionResult EditRole([FromBody]AddRole role ,[FromRoute] int id)
        {
            var isRoleUpdated = _roleServices.EditRole(role, id);
            if (!isRoleUpdated)
            {
                return BadRequest(new
                {
                    error = new { message = "Role_Id_Not_Exists" }
                });
            }
            _employeeServices.UpdateEmployeesRole(role.EmployeeIds, id);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRoleById(int id)
        {
            bool isDeleted = _roleServices.DeleteRole(id);
            if (isDeleted == false) { return NotFound(); }
            return NoContent();
        }

        [HttpGet("department/{departmntId}")]
        public IActionResult GetRoleInDepartment(int departmntId)
        {
            return Ok(_roleServices.GetRoleInDepartment(departmntId));
        }

        [HttpGet("employees/{roleId}")]
        public IActionResult GetRoleWithEmployees(int roleId)
        {
            return Ok(_roleServices.GetRoleWithEmployees(roleId));
        }

        [HttpGet("employees/")]
        public IActionResult GetRolesWithEmployees()
        {
            return Ok(_roleServices.GetRolesWithEmployees());
        }

        [HttpPost("filter")]
        public IActionResult FilterData([FromBody] RoleFiters filterData)
        {
            return Ok(_roleServices.GetFilteredRoles(filterData));
        }
    }
}
