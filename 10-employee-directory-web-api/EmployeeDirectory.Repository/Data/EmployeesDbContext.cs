using EmployeeDirectory.Repository.Data.DataConcerns;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Repository.Data
{
    public class EmployeesDbContext : DbContext
    {
        public EmployeesDbContext(DbContextOptions<EmployeesDbContext> options) : base(options)
        {
        }
        public DbSet<EmployeeData> Employees { get; set; }
        public DbSet<RoleData> Roles { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Status> Status { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            /*            optionsBuilder.LogTo(message => Console.WriteLine(message));
            */
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmployeeData>()
                .HasOne(emp => emp.Manager)
                .WithMany()
                .HasForeignKey(emp => emp.ManagerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<EmployeeData>()
                .HasOne(emp => emp.Role)
                .WithMany()
                .HasForeignKey(emp => emp.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
