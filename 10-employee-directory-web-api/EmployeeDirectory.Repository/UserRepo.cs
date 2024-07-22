using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Repository.ScaffoldData;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository
{
    public class UserRepo : IUserRepo
    {
        private readonly EmployeesDbContext _dbContext;
        public UserRepo(EmployeesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public User? Add(User user)
        {
            if(Get(user.Email) != null)
                return null;
            
            var addedUser =_dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            return addedUser.Entity;
        }

        public User? Get(string email)
        {
            return _dbContext.Users.FirstOrDefault(u => u.Email == email);
        }

    }
}
