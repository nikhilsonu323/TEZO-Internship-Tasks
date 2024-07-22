using EmployeeDirectory.Repository.Data.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IEmployeeRepo
    {
        void Add(EmployeeData employee);
        List<EmployeeData> GetAll();
        EmployeeData? GetById(string id);
        bool RemoveById(string id);
        void Update(EmployeeData newEmployeeDetails);
    }
}