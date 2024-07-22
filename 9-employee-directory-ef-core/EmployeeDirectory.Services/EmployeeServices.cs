using ConsoleTables;
using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Constants;
using EmployeeDirectory.Concerns.Enums;
using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Services.Utilities;

namespace EmployeeDirectory.Services
{
    public class EmployeeServices : IEmployeeServices
    {
        private readonly IEmployeeRepo _employeeRepo;
        private readonly IRoleServices _roleServices;
        public EmployeeServices(IEmployeeRepo employeeRepo, IRoleServices roleServices)
        {
            _employeeRepo = employeeRepo;
            _roleServices = roleServices;
        }

        public void ShowEmployeeServices()
        {
            EmployeeManagementOptions option;
            bool isEnteredOptionValid = true;
            while (true)
            {
                if (isEnteredOptionValid)
                    DisplayMenu();
                else
                    Console.Write(Constants.InvalidChoice);
                if (!Enum.TryParse(Console.ReadLine(), true, out option))
                {
                    isEnteredOptionValid = false;
                    continue;
                }
                switch (option)
                {
                    case EmployeeManagementOptions.AddEmployee:
                        AddEmployee();
                        break;
                    case EmployeeManagementOptions.DisplayAll:
                        DisplayAll();
                        break;
                    case EmployeeManagementOptions.DisplayOne:
                        DisplayOne();
                        break;
                    case EmployeeManagementOptions.EditEmployee:
                        EditEmployee();
                        break;
                    case EmployeeManagementOptions.DeleteEmployee:
                        DeleteEmployee();
                        break;
                    case EmployeeManagementOptions.GoBack:
                        return;
                    default:
                        isEnteredOptionValid = false;
                        continue;
                }
                isEnteredOptionValid = true;
            }
        }

        public void AddEmployee()
        {
            string empNo, firstName, lastName, email, location;
            string? mobileNumber, managerId, project;
            DateOnly? dateOfBirth = null;
            DateOnly joiningDate;

            empNo = HandleInput.GetValidInput("Employee Number", (input) => Validations.IsValidEmpNo(input, RegexString.EmpNo, _employeeRepo))!;
            firstName = HandleInput.GetValidInput("First Name", (input) => Validations.Validate(input, true, RegexString.Name, ValidationResultsEnum.InvalidName))!;
            lastName = HandleInput.GetValidInput("Last Name", (input) => Validations.Validate(input, true, RegexString.Name, ValidationResultsEnum.InvalidName))!;
            email = HandleInput.GetValidInput("Email", (input) => Validations.Validate(input, true, RegexString.Email, ValidationResultsEnum.InvalidEmail))!;
            mobileNumber = HandleInput.GetValidInput("Mobile Number", (input) => Validations.Validate(input, false, RegexString.MobileNumber, ValidationResultsEnum.InvalidMobileNumber));
            location = HandleInput.GetValidInput("Location", (input) => Validations.Validate(input, true))!;

            int roleId = HandleInput.GetRoleId("Department", true, Constants.Departments, _roleServices);
            managerId = HandleInput.GetManagerId("Manager", Mapper.MapToEmployee(_employeeRepo.GetAll()));

            project = HandleInput.SelectFromList("Project", false, Constants.Projects);

            dateOfBirth = HandleInput.GetValidDob("Date Of Birth");
            joiningDate = HandleInput.GetValidJoiningDate("Joining Date", dateOfBirth);
            var employee = new Employee { EmpNo = empNo, FirstName = firstName, LastName = lastName, Email = email, Location = location, MobileNumber = mobileNumber, Project = project, DateOfBirth = dateOfBirth, JoiningDate = joiningDate, RoleId = roleId, ManagerId = managerId };
            _employeeRepo.Add(Mapper.MapToEmployeeData(employee));

            Console.WriteLine("\nEmployee Added Sucessfully..");
        }


        public void DisplayAll()
        {
            var table = new ConsoleTable("Emp No", "Full Name", "Job Title", "Department", "Location", "Joining Date", "Manager ID", "Project", "Mobile Number");
            List<Employee> employees = Mapper.MapToEmployee(_employeeRepo.GetAll());
            if (employees.Count == 0)
            {
                Console.WriteLine("\nNo employees exist currently");
                return;
            }
            Console.WriteLine();
            foreach (var emp in employees)
            {
                string fullName = emp.FirstName + " " + emp.LastName;
                string joiningDate = emp.JoiningDate.ToShortDateString();
                string manager = (emp.ManagerId == null || emp.Manager == null) ? "No Manager" : emp.Manager.FirstName + " " + emp.Manager.LastName;
                /*Console.WriteLine($"{SetWidthTo(employee.EmpNo, 7)} | {SetWidthTo(fullName, 15)} | {SetWidthTo(employee.JobTitle, 12)} | {SetWidthTo(employee.Department, 15)} | {SetWidthTo(employee.Location, 12)} | {SetWidthTo(joiningDate, 10)} | {SetWidthTo(manager, 10)} | {SetWidthTo(employee.Project, 12)} | {SetWidthTo(employee.MobileNumber, 14)} |");*/
                table.AddRow(emp.EmpNo, fullName, emp.Role!.RoleName!, emp.Role!.Department, emp.Location, joiningDate, manager, emp.Project, string.IsNullOrEmpty(emp.MobileNumber) ? "Not Set" : emp.MobileNumber);
            }
            Console.WriteLine(table);
        }


        public void DisplayOne()
        {
            string empNo = ReadEmployeeNumber();
            var employee = Mapper.MapToEmployee(_employeeRepo.GetById(empNo));
            if (employee == null)
            {
                PrintEmployeeNotExists();
            }
            else
            {
                PrintEmployee(employee);
            }
        }


        public void EditEmployee()
        {
            string empNo = ReadEmployeeNumber();
            bool isEditingCompleted = false, isEnteredOptionValid = true;
            Employee? employee = Mapper.MapToEmployee(_employeeRepo.GetById(empNo));
            EmployeeEditableDetailsEnum option;
            if (employee == null)
            {
                PrintEmployeeNotExists();
                return;
            }
            else
            {
                Console.WriteLine("\nEmployee details are : ");
                PrintEmployee(employee);
                Console.WriteLine("\nAre you sure do you want to Edit this Employee");
                string choice = HandleInput.ReadYesOrNo();
                if (choice == "no")
                    return;
            }
            while (!isEditingCompleted)
            {
                if (isEnteredOptionValid)
                    PrintEmployeeEditOptionsMenu();
                if (!Enum.TryParse(Console.ReadLine(), true, out option))
                {
                    Console.Write(Constants.InvalidChoice);
                    isEnteredOptionValid = false;
                    continue;
                }
                switch (option)
                {
                    case EmployeeEditableDetailsEnum.FirstName:
                        employee.FirstName = HandleInput.GetValidInput("First Name", (input) => Validations.Validate(input, false, RegexString.Name, ValidationResultsEnum.InvalidName)) ?? employee.FirstName;
                        break;
                    case EmployeeEditableDetailsEnum.LastName:
                        employee.LastName = HandleInput.GetValidInput("Last Name", (input) => Validations.Validate(input, false, RegexString.Name, ValidationResultsEnum.InvalidName)) ?? employee.LastName;
                        break;
                    case EmployeeEditableDetailsEnum.DateOfBirth:
                        employee.DateOfBirth = HandleInput.GetValidDob("Date Of Birth");
                        break;
                    case EmployeeEditableDetailsEnum.Email:
                        employee.Email = HandleInput.GetValidInput("Email", (input) => Validations.Validate(input, false, RegexString.Email, ValidationResultsEnum.InvalidEmail)) ?? employee.Email;
                        break;
                    case EmployeeEditableDetailsEnum.MobileNumber:
                        employee.MobileNumber = HandleInput.GetValidInput("Mobile Number", (input) => Validations.Validate(input, false, RegexString.MobileNumber, ValidationResultsEnum.InvalidMobileNumber));
                        break;
                    case EmployeeEditableDetailsEnum.Location:
                        employee.Location = HandleInput.GetValidInput("Location", (input) => Validations.Validate(input, false)) ?? employee.Location;
                        break;
                    case EmployeeEditableDetailsEnum.Role:
                        employee.RoleId = HandleInput.GetRoleId("Department", false, Constants.Departments, _roleServices, employee.RoleId);
                        break;
                    case EmployeeEditableDetailsEnum.Manager:
                        employee.ManagerId = HandleInput.GetManagerId("Manager", Mapper.MapToEmployee(_employeeRepo.GetAll())) ?? employee.ManagerId;
                        break;
                    case EmployeeEditableDetailsEnum.Project:
                        employee.Project = HandleInput.SelectFromList("Project", false, Constants.Projects) ?? employee.Project;
                        break;
                    case EmployeeEditableDetailsEnum.SaveAndGoback:
                        isEditingCompleted = true;
                        continue;
                    case EmployeeEditableDetailsEnum.Goback:
                        Console.WriteLine("\nAre you sure do you want to Exit without updating");
                        string choice = HandleInput.ReadYesOrNo();
                        if (choice == "yes")
                            return;
                        return;
                    default:
                        Console.Write(Constants.InvalidChoice);
                        isEnteredOptionValid = false;
                        continue;
                }
                isEnteredOptionValid = true;
            }
            _employeeRepo.Update(Mapper.MapToEmployeeData(employee));
            Console.WriteLine("Employee details updated sucessfully");
        }


        public void DeleteEmployee()
        {
            string empNo = ReadEmployeeNumber();
            Employee? emp = Mapper.MapToEmployee(_employeeRepo.GetById(empNo));
            if (emp != null)
            {
                Console.WriteLine($"Are you sure do you want to delete Employee : {emp.FirstName + "  " + emp.LastName}");
                string choice = HandleInput.ReadYesOrNo();
                if (choice == "yes" && _employeeRepo.RemoveById(empNo))
                    Console.WriteLine("\nEmployee Removed sucessfully");
            }
            else
            {
                PrintEmployeeNotExists();
            }
        }

        #region Helpers
        private void DisplayMenu()
        {
            Console.WriteLine("\n1. Add employee\n2. Display all\n3. Display one\n4. Edit employee\n5. Delete employee\n6. Go Back");
            Console.Write("\n" + Constants.EnterChoice);
        }
        private void PrintEmployeeEditOptionsMenu()
        {
            Console.WriteLine("\n1.First Name 2.LastName 3.Date of birth 4.Email 5.MobileNumber 6.Location 7.Role 8.Manager 9.Project 10.Save&Goback 11.Exit");
            Console.Write("\n" + Constants.EnterChoice);
        }
        private void PrintEmployeeNotExists()
        {
            Console.WriteLine("Employee with this id doesn't exist");
        }
        private void PrintEmployee(Employee emp)
        {
            Console.WriteLine("\nEmp No : " + emp.EmpNo);
            Console.WriteLine($"Full Name : {emp.FirstName} {emp.LastName}");
            Console.WriteLine("Date of Birth : " + emp.DateOfBirth);
            Console.WriteLine("Email : " + emp.Email);
            Console.WriteLine("Mobile Number : " + (string.IsNullOrEmpty(emp.MobileNumber) ? "Not Set" : emp.MobileNumber));
            Console.WriteLine("Joining Date : " + emp.JoiningDate);
            Console.WriteLine("Location : " + emp.Location);
            Console.WriteLine("Role : " + emp.Role!.RoleName);
            Console.WriteLine("Department : " + emp.Role.Department);
            if (!(emp.ManagerId == null || emp.Manager == null))
                Console.WriteLine("Manager Name : " + emp.Manager.FirstName + " " + emp.Manager.LastName);
            Console.WriteLine("Project Name : " + (string.IsNullOrEmpty(emp.Project) ? "Not Assigned" : emp.Project));
        }
        private string ReadEmployeeNumber()
        {
            Console.Write("\nEnter Employee Number of Employee : ");
            string empNo = Console.ReadLine() ?? "";
            return empNo;
        }
        /*private string SetWidthTo(string value, int width)
        {
            if (value.Length > width && width > 3)
            {
                value = value.Substring(0, width - 3);
                value += "...";
            }
            return value.PadRight(width);
        }*/
        #endregion
    }
}
