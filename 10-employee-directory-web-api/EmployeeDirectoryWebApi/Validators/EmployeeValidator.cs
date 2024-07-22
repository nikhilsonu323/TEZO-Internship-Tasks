using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository.Interfaces;
using FluentValidation;

namespace WebApplication.Validators;
//ModelState.AddModelError("employeeId", "EmployeeDTO Id not found.");
public class EmployeeValidator : AbstractValidator<EmployeeDTO>
{
    private readonly IEmployeeServices _employeeServices;
    private readonly IRoleServices _roleServices;
    private readonly IProjectRepo _projectRepo;
    private readonly ILocationRepo _locationRepo;
    private readonly IStatusRepo _statusRepo;
    private const int MaxFileSizeInBytes = 2 * 1024 * 1024; // 2 MB

    public EmployeeValidator(IEmployeeServices employeeServices, IRoleServices roleServices, 
                             IProjectRepo projectRepo, ILocationRepo locationRepo, IStatusRepo statusRepo)
    {
    _employeeServices = employeeServices;
        _roleServices = roleServices;
        _projectRepo = projectRepo;
        _locationRepo = locationRepo;
        _statusRepo = statusRepo;
        
        RuleFor(emp => emp.EmpNo)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .Matches(@"^TZ[0-9]{4}$").WithMessage("The employee ID should start with 'TZ' followed by four digits, such as 'TZ0000'");

        RuleFor(emp => emp.FirstName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .Matches(@"^[a-zA-Z]+$").WithMessage("{PropertyName} should only contain alphabets");


        RuleFor(emp => emp.LastName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .Matches(@"^[a-zA-Z]+$").WithMessage("{PropertyName} should only contain alphabets");


        RuleFor(emp => emp.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .EmailAddress().WithMessage("Invalid email address.");


        RuleFor(emp => emp.RoleId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .Must(BeAValidRoleId).WithMessage("{PropertyName} doesn't Exist");


        RuleFor(emp => emp.LocationId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .Must(BeAValidLocationId).WithMessage("{PropertyName} is doesn't exist");


        RuleFor(emp => emp.ProjectId)
            .Must(BeAValidProjectId).WithMessage("{PropertyName} is doesn't exist");


        RuleFor(emp => emp.StatusId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .Must(BeAValidStatusId).WithMessage("{PropertyName} is doesn't exist");


        RuleFor(emp => emp.MobileNumber)
            .Matches(@"^|(\+[0-9]{1,3}[ -])?[1-9][0-9]{9}$").WithMessage("The mobile number should be 10 digits long, optionally preceded by a country code. For example, +91 1234567890 or 1234567890");


        RuleFor(emp => emp.JoiningDate)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today)).WithMessage("Joining Date Cant exceed current date");


        When(emp => emp.DateOfBirth != null, () =>
        {
            RuleFor(emp => emp.DateOfBirth!.Value)
                .Cascade(CascadeMode.Stop)
                .Must((emp, dateOfBirth) => BeAtLeast18YearsOld(dateOfBirth, emp.JoiningDate)).WithMessage("Employee should be atleast 18 years to join")
                .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today.AddYears(-60))).WithMessage("Employee age cant be more than 60");
        });

        When(emp => emp.ManagerId != null, () =>
        {
            RuleFor(emp => emp.ManagerId)
                .Cascade(CascadeMode.Stop)
                .Matches(@"^TZ[0-9]{4}$").WithMessage("The Manager ID should start with 'TZ' followed by four digits, such as 'TZ0000'")
                .Must(ExistId).WithMessage("Manager with this Id doesn't Exist");
        });

        When(emp => emp.ImageData != null, () =>
        {
            RuleFor(emp => emp.ImageData)
                .Cascade(CascadeMode.Stop)
                .Must(BeValidSize).WithMessage("Image Size Exceeds 2 MB");
        });

    }

    private bool ExistId(string managerId)
    {
        return _employeeServices.GetEmployee(managerId) != null;
    }
    private bool BeValidSize(string? imageData)
    {
        if (imageData == null) return true;
        var base64String = imageData.Split(",")[1];
        try
        {
            return Convert.FromBase64String(base64String).Length > MaxFileSizeInBytes ? false : true;
        }
        catch
        {
            return false;
        }
    }

    private bool BeAValidRoleId(int id)
    {
        return _roleServices.GetRole(id) != null;
    }

    public bool BeAValidProjectId(int? id)
    {
        if (id == null) return true;
        return _projectRepo.IsIdExists(id.Value);
    }

    private bool BeAValidStatusId(int id)
    {
        return _statusRepo.IsIdExists(id);
    }

    private bool BeAValidLocationId(int id)
    {
        return _locationRepo.IsIdExists(id);
    }

    private bool BeAtLeast18YearsOld(DateOnly dateofBirth, DateOnly joiningDate)
    {
        if (dateofBirth > joiningDate.AddYears(-18))
            return false;

        return true;
    }
}
