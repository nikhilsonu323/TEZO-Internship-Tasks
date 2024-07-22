namespace EmployeeDirectory.Concerns.Interfaces
{
    public interface IRoleRepo
    {
        void Add(Role role);
        List<Role> GetAll();
    }
}