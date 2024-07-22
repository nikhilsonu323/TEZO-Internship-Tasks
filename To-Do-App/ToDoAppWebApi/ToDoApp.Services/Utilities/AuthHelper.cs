using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ToDoApp.Contracts;


namespace ToDoApp.Services.Utilities
{
    public class AuthHelper : IAuthHelper
    {
        private readonly IConfiguration _config;

        private const int saltSize = 16; //16 bytes
        private readonly int keySize = 256 / 8; //For 256 bits Hasher
        private readonly int iterations = 100000;
        private readonly HashAlgorithmName _hashAlgorithmName = HashAlgorithmName.SHA256;
        private readonly string delimiter = ":";

        public AuthHelper(IConfiguration config)
        {
            _config = config;
        }

        public string Hash(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(saltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, _hashAlgorithmName, keySize);
            return string.Join(delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));
        }

        public bool Verify(string hashHassword, string inputPassword)
        {
            var elemennts = hashHassword.Split(delimiter);
            var salt = Convert.FromBase64String(elemennts[0]);
            var hash = Convert.FromBase64String(elemennts[1]);
            var hashInput = Rfc2898DeriveBytes.Pbkdf2(inputPassword, salt, iterations, _hashAlgorithmName, keySize);

            return CryptographicOperations.FixedTimeEquals(hash, hashInput);
        }


        public string GetToken(int userId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var userClaims = new[]{
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            };
            var token = new JwtSecurityToken(
                claims: userClaims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
