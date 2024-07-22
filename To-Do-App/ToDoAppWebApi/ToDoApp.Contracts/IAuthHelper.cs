using ToDoApp.Concerns;

namespace ToDoApp.Contracts
{
    public interface IAuthHelper
    {
        string Hash(string password);
        bool Verify(string hashHassword, string inputPassword);
        string GetToken(int userId);
    }
}
