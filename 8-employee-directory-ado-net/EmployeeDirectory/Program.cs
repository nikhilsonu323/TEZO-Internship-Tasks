using EmployeeDirectory;
using EmployeeDirectory.Concerns.Interfaces;
using Microsoft.Extensions.DependencyInjection;
internal class Program
{
    private static void Main(string[] args)
    {
        var serviceProvider = new ServiceCollection().ConfigureServices();

        var roleServices = serviceProvider.GetService<IRoleServices>()!;
        var employeeServices = serviceProvider.GetService<IEmployeeServices>()!;

        bool isEnteredOptionValid = true;
        while (true)
        {
            if (isEnteredOptionValid)
                DisplayMenu();
            else
                Console.Write("Enter valid choice : ");

            if (!int.TryParse(Console.ReadLine(), out int option))
            {
                isEnteredOptionValid = false;
                continue;
            }
            switch (option)
            {
                case 1:
                    employeeServices.ShowEmployeeServices();
                    break;
                case 2:
                    roleServices.ShowRoleServices();
                    break;
                case 3:
                    return;
                default:
                    isEnteredOptionValid = false;
                    continue;
            }
            isEnteredOptionValid = true;
        }
    }

    private static void DisplayMenu()
    {
        Console.WriteLine("\n1. Employee Management\n2. Role Management\n3. Exit");
        Console.Write("Enter your choice : ");
    }
}