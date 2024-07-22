using FluentValidation;
using ToDoApp.Concerns;

namespace ToDoAppWebApi.Validators
{
    public class TaskValidator : AbstractValidator<TaskDTO>
    {
        public TaskValidator()
        {
            RuleFor(task => task.Title)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("{PropertyName} is Required")
            .MaximumLength(100).WithMessage("{PropertyName} cannot exceed 100 characters.");

            RuleFor(task => task.Description)
            .NotEmpty().WithMessage("{PropertyName} is Required");

            RuleFor(task => task.StatusId)
            .NotEmpty().WithMessage("{PropertyName} is Required");
        }
    }
}
