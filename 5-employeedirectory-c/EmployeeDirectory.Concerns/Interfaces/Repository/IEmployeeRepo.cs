namespace EmployeeDirectory.Concerns.Interfaces
{
    public interface IEmployeeRepo
    {
        void Add(Employee employee);
        List<Employee> GetAll();
        List<string> GetAllManagers();
        Employee? GetById(string id);
        bool IsEmployeeIdExists(string id);
        bool RemoveById(string id);
        void Update(Employee newEmployeeDetails);
    }
}