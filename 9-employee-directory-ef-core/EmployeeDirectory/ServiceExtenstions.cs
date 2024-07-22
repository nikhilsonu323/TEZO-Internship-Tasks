using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository;
using EmployeeDirectory.Repository.Data;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Services;
using Microsoft.EntityFrameworkCore;
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

            services.AddDbContext<EmployeeDbContext>(opt =>
            {
                opt.UseSqlServer("Server=10.0.0.27;Database=EmployeeDirectoryEfCore;Trusted_Connection=True;encrypt=false;");
            });
            return services.BuildServiceProvider();
        }
    }
}
