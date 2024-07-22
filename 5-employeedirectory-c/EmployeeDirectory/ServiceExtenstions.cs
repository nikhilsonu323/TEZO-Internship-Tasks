using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository;
using EmployeeDirectory.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
