using EmployeeDirectory.Repository.Data;
using EmployeeDirectory.Repository.Data.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeDirectory.Repository
{
    public class RoleRepo : IRoleRepo
    {
        private readonly string _connectionString = "Server=10.0.0.27;Database=EmployeeDirectoryEfCore;Trusted_Connection=True;encrypt=false;";

        public void Add(RoleData role)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "INSERT INTO Roles (RoleName, Department, Location, Description) VALUES (@rolename, @department, @location, @description);";
                using var command = new SqlCommand(query, connection);
                command.Parameters.Add("@rolename", SqlDbType.NVarChar).Value = role.RoleName;
                command.Parameters.Add("@department", SqlDbType.NVarChar).Value = role.Department;
                command.Parameters.Add("@location", SqlDbType.NVarChar).Value = role.Location;
                command.Parameters.Add("@description", SqlDbType.NVarChar).Value = role.Description;
                
                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        public bool DeleteRole(int id)
        {
            using (var connction = new SqlConnection(_connectionString))
            {
                connction.Open();
                string selectQuery = "SELECT COUNT(1) FROM Roles WHERE Id = @Id";
                using var selectCommand = new SqlCommand(selectQuery, connction);
                selectCommand.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                int count = (int)selectCommand.ExecuteScalar();

                if (count == 0) return false;

                string query = "DELETE FROM Roles WHERE Id = @Id";
                using var deleteCommand = new SqlCommand(query, connction);
                deleteCommand.Parameters.Add("@Id", SqlDbType.Int).Value = id;

                deleteCommand.ExecuteNonQuery();
            }
            return true;
        }

        public List<RoleData> GetAll()
        {
            var roles = new List<RoleData>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "SELECT * FROM Roles";
                using var command = new SqlCommand(query, connection);
                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    roles.Add(GetRoleFromReader(reader));
                }
                return roles;
            }
        }

        public RoleData? GetById(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "SELECT * FROM Roles";
                using var command = new SqlCommand(query, connection);
                using var reader = command.ExecuteReader();
                if (reader.Read())
                {
                    return GetRoleFromReader(reader);
                }
            }
            return null;
        }


        #region Mapper
        private static RoleData GetRoleFromReader(SqlDataReader reader)
        {
            return new RoleData
            {
                Id = (int)reader["id"],
                RoleName = reader["RoleName"].ToString()!,
                Department = reader["Department"].ToString()!,
                Location = reader["Location"].ToString()!,
                Description = reader["Description"].ToString()
            };
        }
        #endregion
    }
}
