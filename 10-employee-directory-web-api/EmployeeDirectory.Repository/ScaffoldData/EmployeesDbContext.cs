using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Repository.ScaffoldData;

public partial class EmployeesDbContext : DbContext
{
    public EmployeesDbContext()
    {
    }

    public EmployeesDbContext(DbContextOptions<EmployeesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Location> Locations { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Status> Statuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){ }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmpNo);

            entity.HasIndex(e => e.LocationId, "IX_Employees_LocationId");

            entity.HasIndex(e => e.ManagerId, "IX_Employees_ManagerId");

            entity.HasIndex(e => e.ProjectId, "IX_Employees_ProjectId");

            entity.HasIndex(e => e.RoleId, "IX_Employees_RoleId");

            entity.HasIndex(e => e.StatusId, "IX_Employees_StatusId");

            entity.HasOne(d => d.Location).WithMany(p => p.Employees).HasForeignKey(d => d.LocationId);

            entity.HasOne(d => d.Manager).WithMany(p => p.InverseManager).HasForeignKey(d => d.ManagerId);

            entity.HasOne(d => d.Project).WithMany(p => p.Employees).HasForeignKey(d => d.ProjectId);

            entity.HasOne(d => d.Role).WithMany(p => p.Employees)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Status).WithMany(p => p.Employees).HasForeignKey(d => d.StatusId);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasIndex(e => e.DepartmentId, "IX_Roles_DepartmentId");

            entity.HasIndex(e => e.LocationId, "IX_Roles_LocationId");

            entity.HasOne(d => d.Department).WithMany(p => p.Roles).HasForeignKey(d => d.DepartmentId);

            entity.HasOne(d => d.Location).WithMany(p => p.Roles).HasForeignKey(d => d.LocationId);
        });

        modelBuilder.Entity<Status>(entity =>
        {
            entity.ToTable("Status");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Email).HasName("PK__Users__A9D105351C29FC86");

            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
