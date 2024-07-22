using EmployeeDirectory.Repository.Data.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeDirectory.Repository
{
    public class EmployeeRepo : IEmployeeRepo
    {
        private readonly string _connectionString = "Server=10.0.0.27;Database=EmployeeDirectoryEfCore;Trusted_Connection=True;encrypt=false;";

        public void Add(EmployeeData employee)
        {
            AddOrUpdateEmployee(employee);
        }

        public List<EmployeeData> GetAll()
        {
            var employees = new List<EmployeeData>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = GetSelectAllJoinQuery();
                using var command = new SqlCommand(query, connection);
                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    employees.Add(GetEmployeeFromReader(reader));
                }
            }
            return employees;
        }

        public EmployeeData? GetById(string id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = GetSelectAllJoinQuery(empno: id);
                using var command = new SqlCommand(query, connection);
                command.Parameters.Add("@Id", SqlDbType.NVarChar).Value = id;

                using var reader = command.ExecuteReader();
                if (reader.Read())
                {
                    return GetEmployeeFromReader(reader);
                }
            }
            return null;
        }

        public bool RemoveById(string id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                if (!IsEmployeeExists(id)) return false;

                conn.Open();
                string query = "DELETE FROM Employees WHERE EmpNo = @Id";
                using var deleteCommand = new SqlCommand(query, conn);
                deleteCommand.Parameters.Add("@Id", SqlDbType.NVarChar).Value = id;
                deleteCommand.ExecuteNonQuery();
            }
            return true;
        }

        public void Update(EmployeeData employee)
        {
            if (IsEmployeeExists(employee.EmpNo))
                AddOrUpdateEmployee(employee, false);
        }


        #region Helpers

        private void AddOrUpdateEmployee(EmployeeData employee, bool isAddEmployee = true)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                string query;
                if (isAddEmployee)
                {
                    query = @"INSERT INTO Employees (EmpNo, FirstName, LastName, Email, Location, RoleId, ManagerId, MobileNumber, Project, DateOfBirth, JoiningDate)
                              VALUES (@EmpNo, @FirstName, @LastName, @Email, @Location, @RoleId, @ManagerId, @MobileNumber, @Project, @DateOfBirth, @JoiningDate)";
                }
                else
                {
                    query = @"UPDATE Employees
                            SET FirstName = @FirstName, LastName = @LastName, Email = @Email, Location = @Location, RoleId = @RoleId, ManagerId = @ManagerId,
                                MobileNumber = @MobileNumber, Project = @Project, DateOfBirth = @DateOfBirth, JoiningDate = @JoiningDate
                            WHERE EmpNo = @EmpNo";
                }

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@EmpNo", employee.EmpNo);
                command.Parameters.AddWithValue("@FirstName", employee.FirstName);
                command.Parameters.AddWithValue("@LastName", employee.LastName);
                command.Parameters.AddWithValue("@Email", employee.Email);
                command.Parameters.AddWithValue("@Location", employee.Location);
                command.Parameters.AddWithValue("@RoleId", employee.RoleId);
                command.Parameters.AddWithValue("@ManagerId", string.IsNullOrEmpty(employee.ManagerId) ? DBNull.Value : employee.ManagerId);
                command.Parameters.AddWithValue("@MobileNumber", string.IsNullOrEmpty(employee.MobileNumber) ? DBNull.Value : employee.MobileNumber);
                command.Parameters.AddWithValue("@Project", string.IsNullOrEmpty(employee.Project) ? DBNull.Value : employee.Project);
                command.Parameters.AddWithValue("@DateOfBirth", employee.DateOfBirth.HasValue ? employee.DateOfBirth.Value : DBNull.Value);
                command.Parameters.AddWithValue("@JoiningDate", employee.JoiningDate);

                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        private bool IsEmployeeExists(string id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string selectQuery = "SELECT COUNT(1) FROM Employees WHERE EmpNo = @Id";
                using var selectCommand = new SqlCommand(selectQuery, conn);
                selectCommand.Parameters.Add("@Id", SqlDbType.NVarChar).Value = id;
                int count = (int)selectCommand.ExecuteScalar();
                if (count == 0) return false;
            }
            return true;
        }

        private static EmployeeData GetEmployeeFromReader(SqlDataReader reader, bool isRoleincluded = true, bool isManagerIncluded = true)
        {
            var emp =  new EmployeeData
            {
                EmpNo = reader["EmpNo"].ToString()!,
                FirstName = reader["FirstName"].ToString()!,
                LastName = reader["LastName"].ToString()!,
                Email = reader["Email"].ToString()!,
                Location = reader["Location"].ToString()!,
                RoleId = (int)reader["RoleId"],
                ManagerId = reader["ManagerId"] == DBNull.Value ? null : reader["ManagerId"].ToString(),
                MobileNumber = reader["MobileNumber"] == DBNull.Value ? null : reader["MobileNumber"].ToString(),
                Project = reader["Project"] == DBNull.Value ? null : reader["Project"].ToString(),
                JoiningDate = DateOnly.FromDateTime(Convert.ToDateTime(reader["JoiningDate"].ToString()!)),
                DateOfBirth = reader["DateOfBirth"] == DBNull.Value ? null : DateOnly.FromDateTime(Convert.ToDateTime(reader["DateOfBirth"].ToString()!)),
            };
            if(isRoleincluded)
            {
                emp.Role = new RoleData()
                {
                    Id = emp.RoleId,
                    RoleName = reader["RoleName"].ToString()!,
                    Department = reader["Department"].ToString()!,
                    Location = reader["RoleLocation"].ToString()!,
                    Description = reader["Description"].ToString()
                };
            }

            if(isManagerIncluded && emp.ManagerId != null)
            {
                emp.Manager = new EmployeeData
                {
                    EmpNo = emp.ManagerId,
                    FirstName = reader["Manager_FirstName"].ToString()!,
                    LastName = reader["Manager_LastName"].ToString()!,
                    Email = reader["Manager_Email"].ToString()!,
                    Location = reader["Manager_Location"].ToString()!,
                    RoleId = (int)reader["Manager_RoleId"],
                    ManagerId = reader["Manager_ManagerId"] == DBNull.Value ? null : reader["Manager_ManagerId"].ToString(),
                    MobileNumber = reader["Manager_MobileNumber"] == DBNull.Value ? null : reader["Manager_MobileNumber"].ToString(),
                    Project = reader["Manager_Project"] == DBNull.Value ? null : reader["Manager_Project"].ToString(),
                    JoiningDate = DateOnly.FromDateTime(Convert.ToDateTime(reader["Manager_JoiningDate"].ToString()!)),
                    DateOfBirth = reader["Manager_DateOfBirth"] == DBNull.Value ? null : DateOnly.FromDateTime(Convert.ToDateTime(reader["Manager_DateOfBirth"].ToString()!)),
                };
            }
            return emp;
        }

        private static string GetSelectAllJoinQuery(bool isRoleDetailsRequired = true, bool isMangerDetailsRequired = true, string? empno = null)
        {
            var selectEmployeesQuery = @"SELECT e.EmpNo, e.FirstName, e.LastName, e.Email, e.Location, e.RoleId, e.ManagerId, e.MobileNumber,
                        e.Project, e.DateOfBirth, e.JoiningDate";
            if (isRoleDetailsRequired)
            {
                selectEmployeesQuery += ", r.RoleName, r.Department, r.Location AS RoleLocation, r.Description";
            }
            if (isMangerDetailsRequired)
            {
                selectEmployeesQuery += @", m.FirstName AS Manager_FirstName, m.LastName AS Manager_LastName, m.Email AS Manager_Email,
	                    m.Location AS Manager_Location, m.RoleId AS Manager_RoleId, m.ManagerId AS Manager_ManagerId,
	                    m.MobileNumber AS Manager_MobileNumber , m.Project AS Manager_Project, 
	                    m.DateOfBirth AS Manager_DateOfBirth, m.JoiningDate AS Manager_JoiningDate ";
            }
            selectEmployeesQuery += @"FROM Employees e
	                    INNER JOIN Roles r ON e.RoleId = r.Id
	                    LEFT JOIN Employees m ON e.ManagerId = m.EmpNo ";
            if (!string.IsNullOrEmpty(empno))
            {
                selectEmployeesQuery += "WHERE e.EmpNo = @Id";
            }

            return selectEmployeesQuery;
        }

        #endregion
    }
}


/*
 
SELECT e.EmpNo, e.FirstName, e.LastName, e.Email, e.Location, e.RoleId, e.ManagerId, e.MobileNumber,
    e.Project, e.DateOfBirth, e.JoiningDate,
    
	r.RoleName, r.Department, r.Location AS RoleLocation, r.Description,
	
    m.FirstName AS Manager_FirstName, m.LastName AS Manager_LastName, m.Email AS Manager_Email,
	m.Location AS Manager_Location, m.RoleId AS Manager_RoleId, m.ManagerId AS Manager_ManagerId,
	m.MobileNumber AS Manager_MobileNumber , m.Project AS Manager_Project, 
	m.DateOfBirth AS Manager_DateOfBirth, m.JoiningDate AS Manager_JoiningDate

	FROM Employees e
	INNER JOIN Roles r ON e.RoleId = r.Id
	LEFT JOIN Employees m ON e.ManagerId = m.EmpNo

 */