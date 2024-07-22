using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IDepartmentRepo
    {
        public void Add(Department department);
        public bool Remove(int id);
        public Task<List<Department>> Get();
        public bool IsIdExists(int id);
        public Task<List<Department>> GetFiltered(HashSet<int>? statusId, HashSet<int>? locationId);
    }
}
