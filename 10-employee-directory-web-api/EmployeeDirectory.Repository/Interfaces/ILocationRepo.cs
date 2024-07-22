using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface ILocationRepo
    {
        public void Add(Location location);
        public bool Remove(int id);
        public Task<List<Location>> Get();
        public bool IsIdExists(int id);
        public Task<List<Location>> GetFiltered(HashSet<int>? statusId, HashSet<int>? departmentId);
    }
}
