using EmployeeDirectory.Concerns.Enums;
using EmployeeDirectory.Repository.Interfaces;
using System.Text.RegularExpressions;

namespace EmployeeDirectory.Services.Utilities
{
    internal static class Validations
    {
        public static ValidationResultsEnum IsValidEmpNo(string input, string? pattern, IEmployeeRepo employeeRepo)
        {
            var validationResult = Validate(input, true, pattern, ValidationResultsEnum.InvalidEmpNo);
            if (validationResult == ValidationResultsEnum.Valid)
                return IsEmployeeIdExists(input, employeeRepo);

            return validationResult;
        }

        public static ValidationResultsEnum Validate(string input, bool isRequired, string? pattern = null, ValidationResultsEnum invalidEnumValue = ValidationResultsEnum.NotValid)
        {
            if (isRequired && string.IsNullOrEmpty(input))
                return ValidationResultsEnum.Empty;

            if ((isRequired == false && string.IsNullOrEmpty(input)) || pattern == null)
                return ValidationResultsEnum.Valid;

            Regex regex = new Regex(pattern);
            if (!regex.IsMatch(input))
                return invalidEnumValue;

            return ValidationResultsEnum.Valid;
        }

        public static ValidationResultsEnum IsJoiningDateValid(string input, DateOnly? dob)
        {
            if (string.IsNullOrEmpty(input))
                return ValidationResultsEnum.Empty;

            if (!DateOnly.TryParseExact(input, "d/M/yyyy", null, System.Globalization.DateTimeStyles.None, out DateOnly joiningDate))
                return ValidationResultsEnum.InvalidDate;

            if (joiningDate > DateOnly.FromDateTime(DateTime.Today))
                return ValidationResultsEnum.JoiningDateIsGreaterThanCurrentDate;

            if (dob != null && GetDateDifferenceInYears(dob.Value, joiningDate) < 18)
                return ValidationResultsEnum.MinimunJoiningAgeRequired;

            return ValidationResultsEnum.Valid;

        }

        public static ValidationResultsEnum IsDobValid(string input)
        {
            if (string.IsNullOrEmpty(input))
                return ValidationResultsEnum.Valid;

            if (!DateOnly.TryParseExact(input, "d/M/yyyy", null, System.Globalization.DateTimeStyles.None, out DateOnly dob))
                return ValidationResultsEnum.InvalidDate;

            int age = GetDateDifferenceInYears(dob, DateOnly.FromDateTime(DateTime.Today));

            if (age < 18 || age > 100)
                return ValidationResultsEnum.AgeLimitExceeded;

            return ValidationResultsEnum.Valid;
        }

        private static int GetDateDifferenceInYears(DateOnly pastDate, DateOnly futureDate)
        {
            int age = futureDate.Year - pastDate.Year;
            if (pastDate > futureDate.AddYears(-age))
                age -= 1;

            return age;
        }

        private static ValidationResultsEnum IsEmployeeIdExists(string EmpNo, IEmployeeRepo employeeRepo)
        {
            if (employeeRepo.GetById(EmpNo) != null)
                return ValidationResultsEnum.Exists;

            return ValidationResultsEnum.Valid;
        }
    }
}
