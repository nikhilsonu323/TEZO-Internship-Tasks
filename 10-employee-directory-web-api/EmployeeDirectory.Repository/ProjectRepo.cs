using EmployeeDirectory.Repository.ScaffoldData;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Repository
{
    public class ProjectRepo : IProjectRepo
    {
        private readonly EmployeesDbContext _dbContext;
        public ProjectRepo(EmployeesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async void Add(Project project)
        {
            _dbContext.Projects.Add(project);
            await _dbContext.SaveChangesAsync();
        }

        public bool IsIdExists(int id)
        {
            return _dbContext.Projects.FirstOrDefault(p => p.Id == id) != null;
        }

        public async Task<List<Project>> Get()
        {
            return await _dbContext.Projects.ToListAsync();
        }

        public bool Remove(int id)
        {
            var project = _dbContext.Projects.Find(id);
            if (project == null) { return false; }
            _dbContext.Projects.Remove(project);
            return true;
        }
    }
}
