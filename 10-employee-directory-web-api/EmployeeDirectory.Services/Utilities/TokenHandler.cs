using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeDirectory.Services.Utilities
{
    public class TokenHandler
    {
        private readonly IConfiguration _config;
        public TokenHandler(IConfiguration config) 
        {
            _config = config;
        }
        public string GetToken(User user, DateTime expiresIn)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var userClaims = new[]{
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
            };
            var token = new JwtSecurityToken(
                /*issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],*/
                claims: userClaims,
                expires: expiresIn,
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
