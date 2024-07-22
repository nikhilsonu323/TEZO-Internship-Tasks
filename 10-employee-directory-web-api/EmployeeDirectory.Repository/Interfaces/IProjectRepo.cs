using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IProjectRepo
    {
        public void Add(Project project);
        public bool Remove(int id);
        public bool IsIdExists(int id);
        public Task<List<Project>> Get();
    }
}
