using EmployeeDirectory.Repository.Data.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IRoleRepo
    {
        void Add(RoleData role);

        List<RoleData> GetAll();

        RoleData? GetById(int id);

        bool DeleteRole(int id);
    }
}