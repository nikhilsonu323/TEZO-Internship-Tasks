using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Interfaces;
using System.Text.Json;

namespace EmployeeDirectory.Repository
{
    public class RoleRepo : IRoleRepo
    {
        private readonly string _filePath;

        public RoleRepo()
        {
            string? path = Directory.GetParent(Directory.GetCurrentDirectory())?.Parent?.Parent?.Parent?.FullName;
            _filePath = path + "\\EmployeeDirectory.Repository\\Data source\\Roles.json";
        }
        public void Add(Role role)
        {
            List<Role> roles = GetRolesFromJson();
            roles.Add(role);
            WriteRolesToJson(roles);
        }
        public List<Role> GetAll()
        {
            return GetRolesFromJson();
        }

        #region Helpers
        List<Role> GetRolesFromJson()
        {
            if (!File.Exists(_filePath)) { return []; }
            string rolesJson = File.ReadAllText(_filePath);
            try { return JsonSerializer.Deserialize<List<Role>>(rolesJson) ?? []; }
            catch { return []; }
        }
        void WriteRolesToJson(List<Role> roles)
        {
            string rolesJson = JsonSerializer.Serialize(roles);
            File.WriteAllText(_filePath, rolesJson);
        }
        #endregion
    }

}
