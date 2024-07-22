using EmployeeDirectory.Concerns.DTO_s;

namespace EmployeeDirectory.Concerns.Interfaces
{
    public interface IAuthService
    {
        AuthResponse? SignUp(AddUserDTO userDTO);

        AuthResponse? Login(LoginDTO userDTO);
    }
}
