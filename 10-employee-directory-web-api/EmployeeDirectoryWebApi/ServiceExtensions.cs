using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Services;
using EmployeeDirectory.Services.Utilities;

namespace EmployeeDirectoryWebApi
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddDependency(this IServiceCollection services)
        {

            services.AddTransient<IEmployeeServices, EmployeeServices>();
            services.AddTransient<IRoleServices, RoleServices>();
            services.AddTransient<IAuthService, AuthService>();

            services.AddScoped<IEmployeeRepo, EmployeeRepo>();
            services.AddScoped<IRoleRepo, RoleRepo>();
            services.AddScoped<IUserRepo, UserRepo>();

            services.AddScoped<ILocationRepo, LocationRepo>();
            services.AddScoped<IProjectRepo, ProjectRepo>();
            services.AddScoped<IDepartmentRepo, DepartmentRepo>();
            services.AddScoped<IStatusRepo, StatusRepo>();

            services.AddScoped<TokenHandler, TokenHandler>();
            services.AddScoped<PasswordHasher, PasswordHasher>();

            return services;
        }
    }
}
