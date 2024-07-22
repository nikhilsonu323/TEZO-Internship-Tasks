using ConsoleTables;
using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Constants;
using EmployeeDirectory.Concerns.Enums;
using EmployeeDirectory.Concerns.Interfaces;
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
        void AddDummyData()
        {
            DateOnly joiningDate = DateOnly.FromDateTime(DateTime.Now);
            var employee = new Employee { EmpNo = "TZ0000", FirstName = "Luffy", LastName = "Monkey D", Email = "luffy@strawhats.com", JobTitle = "jobTitle", Location = "East blue", Department = "Pirate", MobileNumber = "0987654321", ManagerId = "", Project = "One piece", JoiningDate = joiningDate };
            _employeeRepo.Add(employee);
            employee = new Employee { EmpNo = "TZ0001", FirstName = "Roronora", LastName = "Zoro", Email = "zoro@strawhats.com", JobTitle = "swordsman", Location = "East blue", Department = "Pirate", MobileNumber = "0987654322", ManagerId = "TZ0000", Project = "One piece", JoiningDate = joiningDate };
            _employeeRepo.Add(employee);
            employee = new Employee { EmpNo = "TZ0002", FirstName = "Prince", LastName = "Sanji", Email = "sanji@strawhats.com", JobTitle = "cook", Location = "North blue", Department = "Pirate", MobileNumber = "0987654323", ManagerId = "TZ0000", Project = "One piece", JoiningDate = joiningDate };
            _employeeRepo.Add(employee);
        }
        public void AddEmployee()
        {
            string empNo, firstName, lastName, email, jobTitle, department, mobileNumber, manager, project, location;
            DateOnly? dateOfBirth = null;
            DateOnly joiningDate;

            empNo = HandleInput.GetValidInput("Employee Number", (input) => Validations.IsValidEmpNo(input, RegexString.EmpNo, _employeeRepo));
            firstName = HandleInput.GetValidInput("First Name", (input) => Validations.Validate(input, true, RegexString.Name, ValidationResultsEnum.InvalidName));
            lastName = HandleInput.GetValidInput("Last Name", (input) => Validations.Validate(input, true, RegexString.Name, ValidationResultsEnum.InvalidName));
            email = HandleInput.GetValidInput("Email", (input) => Validations.Validate(input, true, RegexString.Email, ValidationResultsEnum.InvalidEmail));
            mobileNumber = HandleInput.GetValidInput("Mobile Number", (input) => Validations.Validate(input, false, RegexString.MobileNumber, ValidationResultsEnum.InvalidMobileNumber));
            location = HandleInput.GetValidInput("Location", (input) => Validations.Validate(input, true));

            department = HandleInput.ChooseDepartment("Department", true, Constants.Departments, _roleServices);
            jobTitle = HandleInput.SelectFromList("Job Title", true, _roleServices.GetRolesByDepartment(department));
            manager = HandleInput.SelectFromList("Manager", false, _employeeRepo.GetAllManagers());
            project = HandleInput.SelectFromList("Project", false, Constants.Projects);

            dateOfBirth = HandleInput.GetValidDob("Date Of Birth");
            joiningDate = HandleInput.GetValidJoiningDate("Joining Date", dateOfBirth);
            var employee = new Employee { EmpNo = empNo, FirstName = firstName, LastName = lastName, Email = email, JobTitle = jobTitle, Location = location, Department = department, MobileNumber = mobileNumber, ManagerId = manager, Project = project, DateOfBirth = dateOfBirth, JoiningDate = joiningDate };
            _employeeRepo.Add(employee);
            Console.WriteLine("\nEmployee Added Sucessfully..");
        }


        public void DisplayAll()
        {
            var table = new ConsoleTable("Emp No", "Full Name", "Job Title", "Department", "Location", "Joining Date", "Manager ID", "Project", "Mobile Number");
            List<Employee> employees = _employeeRepo.GetAll();
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
                string manager = emp.ManagerId == null || emp.ManagerId == "" ? "No Manager" : emp.ManagerId[..6];
                /*Console.WriteLine($"{SetWidthTo(emp.EmpNo, 7)} | {SetWidthTo(fullName, 15)} | {SetWidthTo(emp.JobTitle, 12)} | {SetWidthTo(emp.Department, 15)} | {SetWidthTo(emp.Location, 12)} | {SetWidthTo(joiningDate, 10)} | {SetWidthTo(manager, 10)} | {SetWidthTo(emp.Project, 12)} | {SetWidthTo(emp.MobileNumber, 14)} |");*/
                table.AddRow(emp.EmpNo, fullName, emp.JobTitle, emp.Department, emp.Location, joiningDate, manager, emp.Project, string.IsNullOrEmpty(emp.MobileNumber) ? "Not Set" : emp.MobileNumber);
            }
            Console.WriteLine(table);
        }

        public void DisplayOne()
        {
            string empNo = ReadEmployeeNumber();
            Employee? emp = _employeeRepo.GetById(empNo);
            if (emp == null)
            {
                PrintEmployeeNotExists();
            }
            else
            {
                PrintEmployee(emp);
            }
        }

        public void EditEmployee()
        {
            string empNo = ReadEmployeeNumber();
            bool isEditingCompleted = false, isEnteredOptionValid = true;
            Employee? employee = _employeeRepo.GetById(empNo);
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
                        employee.FirstName = HandleInput.GetValidInput("First Name", (input) => Validations.Validate(input, true, RegexString.Name, ValidationResultsEnum.InvalidName));
                        break;
                    case EmployeeEditableDetailsEnum.LastName:
                        employee.LastName = HandleInput.GetValidInput("Last Name", (input) => Validations.Validate(input, true, RegexString.Name, ValidationResultsEnum.InvalidName));
                        break;
                    case EmployeeEditableDetailsEnum.DateOfBirth:
                        employee.DateOfBirth = HandleInput.GetValidDob("Date Of Birth");
                        break;
                    case EmployeeEditableDetailsEnum.Email:
                        employee.Email = HandleInput.GetValidInput("Email", (input) => Validations.Validate(input, true, RegexString.Email, ValidationResultsEnum.InvalidEmail));
                        break;
                    case EmployeeEditableDetailsEnum.MobileNumber:
                        employee.MobileNumber = HandleInput.GetValidInput("Mobile Number", (input) => Validations.Validate(input, false, RegexString.MobileNumber, ValidationResultsEnum.InvalidMobileNumber));
                        break;
                    case EmployeeEditableDetailsEnum.Location:
                        employee.Location = HandleInput.GetValidInput("Location", (input) => Validations.Validate(input, true));
                        break;
                    case EmployeeEditableDetailsEnum.JobTitle:
                        employee.JobTitle = HandleInput.SelectFromList("Job Title", true, _roleServices.GetRolesByDepartment(employee.Department));
                        break;
                    case EmployeeEditableDetailsEnum.Department:
                        string department = HandleInput.ChooseDepartment("Department", false, Constants.Departments, _roleServices);
                        if (department != employee.Department)
                        {
                            employee.Department = department;
                            employee.JobTitle = HandleInput.SelectFromList("Job Title", true, _roleServices.GetRolesByDepartment(department));
                        }
                        break;
                    case EmployeeEditableDetailsEnum.Manager:
                        employee.ManagerId = HandleInput.SelectFromList("Manager", false, _employeeRepo.GetAllManagers());
                        break;
                    case EmployeeEditableDetailsEnum.Project:
                        employee.Project = HandleInput.SelectFromList("Project", false, Constants.Projects);
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
            _employeeRepo.Update(employee);
            Console.WriteLine("Employee details updated sucessfully");
        }

        public void DeleteEmployee()
        {
            string empNo = ReadEmployeeNumber();
            Employee? emp = _employeeRepo.GetById(empNo);
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
            Console.WriteLine("\n1.First Name 2.LastName 3.Date of birth 4.Email 5.MobileNumber 6.Location 7.Role 8.Department 9.Manager 10.Project 11.Save&Goback 12.Exit");
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
            Console.WriteLine("Mobile Number : " + emp.MobileNumber);
            Console.WriteLine("Joining Date : " + emp.JoiningDate);
            Console.WriteLine("Location : " + emp.Location);
            Console.WriteLine("Role : " + emp.JobTitle);
            Console.WriteLine("Department : " + emp.Department);
            Console.WriteLine("Manager Name : " + emp.ManagerId);
            Console.WriteLine("Project Name : " + emp.Project);
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
