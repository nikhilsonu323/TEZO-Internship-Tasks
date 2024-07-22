using EmployeeDirectory.Concerns.DTO_s;
using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeDirectoryWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO loginDetails)
        {
            var result = _authService.Login(loginDetails);
            if(result == null)
            {
                return BadRequest(new {
                    error = new { message = "Invalid_Credentials"}
                });
            }
            return Ok(result);
        }

        [HttpPost("signup")]
        public IActionResult SignUp(AddUserDTO userDetails)
        {
            var result = _authService.SignUp(userDetails);
            if (result == null)
            {
                return Unauthorized(new
                {
                    error = new { message = "User_Exists" }
                });
            }
            return Ok(result);
        }

    }
}