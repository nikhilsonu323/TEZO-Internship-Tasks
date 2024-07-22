using EmployeeDirectory.Concerns.Constants;
using EmployeeDirectory.Concerns.Enums;
using EmployeeDirectory.Concerns.Interfaces;

namespace EmployeeDirectory.Services.Utilities
{
    delegate ValidationResultsEnum Validator(string input, DateOnly? date);
    internal static class RegexString
    {
        public static readonly string EmpNo = @"^TZ[0-9]{4}$";
        public static readonly string Name = @"^[a-zA-Z]+$";
        public static readonly string Email = @"^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9]+[.](com|in)$";
        public static readonly string MobileNumber = @"^(|(\+[0-9]{1,3}[ -])?[1-9][0-9]{9})$";
    }
    internal static class HandleInput
    {
        public static string SelectFromList(string inputFieldName, bool isRequired, List<string> list)
        {
            string input;
            int index;
            if (list.Count == 0)
            {
                Console.WriteLine($"Currently no {inputFieldName}'s exists to choose");
                return "";
            }
            Console.WriteLine($"\nSelect {inputFieldName}");
            for (int i = 0; i < list.Count; i++)
            {
                Console.WriteLine($"{i + 1}. {list[i]}");
            }
            Console.Write(Constants.EnterChoice);
            while (true)
            {
                input = Console.ReadLine() ?? "";
                input = input.Trim();
                if (input.Length == 0 && !isRequired) { return input; }
                if (int.TryParse(input, out index) == false || index > list.Count || index <= 0)
                {
                    Console.Write(Constants.InvalidChoice);
                }
                else { return list[index - 1]; }
            }
        }
        public static string ChooseDepartment(string inputFieldName, bool isRequired, List<string> list, IRoleServices roleServices)
        {
            string department = SelectFromList(inputFieldName, isRequired, list);
            var roles = roleServices.GetRolesByDepartment(department);
            while(roles.Count == 0)
            {
                Console.WriteLine("\nThere are currently no roles in this department to assign.");
                Console.WriteLine("Do you want to add new role in this department or select different Department");
                Console.Write("Choose  1.Add new Role  2.Differnt Department : ");
                while (true)
                {
                    if (int.TryParse(Console.ReadLine(), out int option) && option > 0 && option < 3)
                    {
                        if (option == 1)
                        {
                            roleServices.AddRoleInDepartment(department);
                            return department;
                        }
                        else
                        {
                            department = SelectFromList(inputFieldName, isRequired, Constants.Departments);
                            roles = roleServices.GetRolesByDepartment(department);
                            break;
                        }
                    }
                    else
                        Console.Write(Constants.InvalidChoice);
                }
            }
            return department;
        }

        public static string GetValidInput(string inputFieldName, Func<string, ValidationResultsEnum> validator)
        {
            string input;
            ValidationResultsEnum validatorResult;
            while (true)
            {
                Console.Write($"\nEnter {inputFieldName} : ");
                input = Console.ReadLine() ?? "";
                input = input.Trim();
                validatorResult = validator(input);
                if (validatorResult == ValidationResultsEnum.Valid)
                    return input;
                DisplayErrorMsg(inputFieldName, validatorResult);
            }
        }



        public static DateOnly? GetValidDob(string inputFieldName)
        {
            string input = GetValidInput(inputFieldName, Validations.IsDobValid);
            if (string.IsNullOrEmpty(input))
                return null;
            else
                return DateOnly.ParseExact(input, "d/M/yyyy");
        }

        public static DateOnly GetValidJoiningDate(string inputFieldName, DateOnly? dob)
        {
            string input = GetValidInput(inputFieldName, (input) => Validations.IsJoiningDateValid(input, dob));
            return DateOnly.ParseExact(input, "d/M/yyyy");
        }

        public static string ReadYesOrNo()
        {
            string choice = "";
            while (choice != "no" && choice != "yes")
            {
                Console.Write("Enter Yes or No : ");
                choice = Console.ReadLine() ?? "";
                choice = choice.ToLower();
            }
            return choice;
        }


        private static void DisplayErrorMsg(string inputFieldName, ValidationResultsEnum validatorResult)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            switch (validatorResult)
            {
                case ValidationResultsEnum.NotValid:
                    Console.WriteLine($"Invalid {inputFieldName}");
                    break;
                case ValidationResultsEnum.Empty:
                    Console.WriteLine($"{inputFieldName} is Required");
                    break;
                case ValidationResultsEnum.Exists:
                    Console.WriteLine($"{inputFieldName} already exists");
                    break;
                case ValidationResultsEnum.InvalidDate:
                    Console.WriteLine("Enter valid Date Format (DD/MM/YYYY)");
                    break;
                case ValidationResultsEnum.JoiningDateIsGreaterThanCurrentDate:
                    Console.WriteLine("Joining date cant exceed current date");
                    break;
                case ValidationResultsEnum.AgeLimitExceeded:
                    Console.WriteLine("Age should be in the range of 18 to 100");
                    break;
                case ValidationResultsEnum.JoiningDateGreaterThanDob:
                    Console.WriteLine("Joining date cant exceed Date of birth");
                    break;
                case ValidationResultsEnum.MinimunJoiningAgeRequired:
                    Console.WriteLine("Employee should have minimun 18 years to join");
                    break;
                case ValidationResultsEnum.InvalidEmpNo:
                    Console.WriteLine("The employee number should start with 'TZ' followed by four digits, such as 'TZ0000'");
                    break;
                case ValidationResultsEnum.InvalidName:
                    Console.WriteLine("Name should only contain alphabets");
                    break;
                case ValidationResultsEnum.InvalidEmail:
                    Console.WriteLine("provide a valid email address in the format username@mailserver.domain");
                    break;
                case ValidationResultsEnum.InvalidMobileNumber:
                    Console.WriteLine("The mobile number should be 10 digits long, optionally preceded by a country code. For example, +91 1234567890 or 1234567890");
                    break;
            }
            Console.ResetColor();
        }
    }
}
