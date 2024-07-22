using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IUserRepo
    {
        public User? Add(User user);
        public User? Get(string email);
    }
}
