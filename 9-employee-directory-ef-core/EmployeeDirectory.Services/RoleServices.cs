using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Constants;
using EmployeeDirectory.Concerns.Enums;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Services.Utilities;

namespace EmployeeDirectory.Services
{
using EmployeeDirectory.Concerns.Interfaces;
    public class RoleServices : IRoleServices
    {
        private readonly IRoleRepo _roleRepo;

        public RoleServices(IRoleRepo roleRepo)
        {
            _roleRepo = roleRepo;
        }


        public void ShowRoleServices()
        {
            RoleManagementOptions option;
            bool isEnteredOptionValid = true;
            while (true)
            {
                if (isEnteredOptionValid)
                    DisplayMenu();
                else
                    Console.Write(Constants.InvalidChoice);
                if (!Enum.TryParse(Console.ReadLine(), out option))
                {
                    isEnteredOptionValid = false;
                    continue;
                }
                switch (option)
                {
                    case RoleManagementOptions.AddRole:
                        AddRole();
                        break;
                    case RoleManagementOptions.DisplayAll:
                        DisplayAll();
                        break;
                    case RoleManagementOptions.GoBack:
                        return;
                    default:
                        isEnteredOptionValid = false;
                        continue;
                }
                isEnteredOptionValid = true;
            }
        }
        public void AddRole()
        {
            string roleName, department, location;
            roleName = HandleInput.GetValidInput("Role Name", (input) => Validations.Validate(input, true))!;
            department = HandleInput.SelectFromList("Department", true, Constants.Departments)!;
            location = HandleInput.GetValidInput("Location", (input) => Validations.Validate(input, true))!;
            string? description = HandleInput.GetValidInput("Role Description", (input) => Validations.Validate(input, false));
            Role role = new Role(roleName, department, location, description, 0);
            _roleRepo.Add(Mapper.MapToRoleData(role));
        }

        public void DisplayAll()
        {
            var roles = Mapper.MapToRole(_roleRepo.GetAll());
            if (roles.Count == 0)
            {
                Console.WriteLine("There aren't any roles currently");
                return;
            }
            string seperator = ": ";
            int width = 18;
            foreach (var role in roles)
            {
                PrintRoles(seperator, width, role);
            }
        }

        public List<Role> GetRolesByDepartment(string department)
        {
            List<Role> rolesList = Mapper.MapToRole(_roleRepo.GetAll());
            return (rolesList.Where(role => role.Department == department).Select(role => role)).ToList();
        }

        public void AddRoleInDepartment(string department)
        {
            string roleName, location, description;
            roleName = HandleInput.GetValidInput("Role Name", (input) => Validations.Validate(input, true))!;
            location = HandleInput.GetValidInput("Location", (input) => Validations.Validate(input, true))!;
            description = HandleInput.GetValidInput("Role Description", (input) => Validations.Validate(input, false))!;
            Role role = new Role(roleName, department, location, description, 0);
            _roleRepo.Add(Mapper.MapToRoleData(role));
        }



        #region Helpers
        void PrintRoles(string seperator, int totalWidth, Role role)
        {
            Console.WriteLine("\n" + "Role Name".PadRight(totalWidth) + seperator + role.RoleName);
            Console.WriteLine("Department Name".PadRight(totalWidth) + seperator + role.Department);
            Console.WriteLine("Location Name".PadRight(totalWidth) + seperator + role.Location);
            Console.WriteLine("Description Name".PadRight(totalWidth) + seperator + (string.IsNullOrEmpty(role.Description) ? "No Description about this role" : role.Description));
        }
        void DisplayMenu()
        {
            Console.WriteLine("\n1. Add Role\n2. Display all\n3. Go Back");
            Console.Write("\n" + Constants.EnterChoice);
        }
        #endregion
    }
}
