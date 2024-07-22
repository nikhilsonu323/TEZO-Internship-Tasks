using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeDirectory
{
    internal static class ServiceExtenstions
    {
        public static IServiceProvider ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<IEmployeeRepo, EmployeeRepo>();
            services.AddScoped<IRoleRepo, RoleRepo>();

            services.AddTransient<IEmployeeServices, EmployeeServices>();
            services.AddTransient<IRoleServices, RoleServices>();

            return services.BuildServiceProvider();
        }
    }
}
