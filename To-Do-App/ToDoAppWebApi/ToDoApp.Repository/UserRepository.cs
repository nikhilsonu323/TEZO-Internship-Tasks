using Microsoft.EntityFrameworkCore;
using ToDoApp.Repository.Data;
using ToDoApp.Repository.Data.Models;
using ToDoApp.Repository.Interfaces;

namespace ToDoApp.Repository
{
    public class UserRepository : IUserRepository
    {
        private ToDoAppContext _dbContext;

        public UserRepository(ToDoAppContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User> AddUserAsync(User user)
        {
            var userEntry = _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return userEntry.Entity;
        }

        public async Task<User?> GetUserAsync(string username)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(user => user.Username == username);
        }
    }
}
