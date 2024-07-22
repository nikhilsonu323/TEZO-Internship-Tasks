using Microsoft.EntityFrameworkCore;
using EmployeeDirectory.Repository.Data.DataConcerns;

namespace EmployeeDirectory.Repository.Data
{
    public class EmployeeDbContext : DbContext
    {
        public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : base(options)
        {       
        }

        public EmployeeDbContext()
        {
        }
        public DbSet<EmployeeData> Employees { get; set; }
        public DbSet<RoleData> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmployeeData>()
                .HasOne(emp => emp.Manager)
                .WithMany()
                .HasForeignKey(emp => emp.ManagerId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
