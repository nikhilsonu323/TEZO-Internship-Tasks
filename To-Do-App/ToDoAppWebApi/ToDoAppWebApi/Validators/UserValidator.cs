using FluentValidation;
using ToDoApp.Concerns;

namespace ToDoAppWebApi.Validators
{
    public class UserValidator : AbstractValidator<UserDTO>
    {
        public UserValidator() 
        {
            RuleFor(user => user.Username)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .MaximumLength(50).WithMessage("{PropertyName} cannot exceed 50 characters.");

            RuleFor(user => user.Password)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .MinimumLength(8).WithMessage("{PropertyName} must be at least 8 characters long.");
        }
    }
}
