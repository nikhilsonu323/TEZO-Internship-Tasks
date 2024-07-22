using EmployeeDirectory.Concerns;
using EmployeeDirectory.Repository.Interfaces;
using FluentValidation;

namespace WebApplication.Validators
{
    public class RoleValidator : AbstractValidator<RoleDTO>
    {
        private readonly IDepartmentRepo _departmentRepo;
        private readonly ILocationRepo _locationRepo;
        public RoleValidator(IDepartmentRepo departmentRepo, ILocationRepo locationRepo)
        {
            _departmentRepo = departmentRepo;
            _locationRepo = locationRepo;

            RuleFor(role => role.RoleName)
                .NotEmpty().WithMessage("{PropertyName} is Required");

            RuleFor(role => role.DepartmentId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} is Required")
                .Must(BeAValidDepartmentId).WithMessage("{PropertyName} doesn't exist");

            RuleFor(role => role.LocationId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} is Required")
                .Must(BeAValidLocationId).WithMessage("{PropertyName} doesn't exist");
        }

        public bool BeAValidDepartmentId(int id)
        {
            return _departmentRepo.IsIdExists(id);
        }
        public bool BeAValidLocationId(int id)
        {
            return _locationRepo.IsIdExists(id);
        }
    }
}
