using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IStatusRepo
    {
        public void Add(Status status);
        public bool Remove(int id);
        public Task<List<Status>> Get();
        public bool IsIdExists(int id);
    }
}
