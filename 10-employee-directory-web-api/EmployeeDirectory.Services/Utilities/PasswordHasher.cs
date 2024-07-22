using System.Security.Cryptography;
using System.Text;

namespace EmployeeDirectory.Services.Utilities
{
    public class PasswordHasher
    {
        private const int saltSize = 16; //16 bytes
        private readonly int keySize = 256 / 8; //For 256 bits Hasher
        private readonly int iterations = 100000;
        private readonly HashAlgorithmName _hashAlgorithmName = HashAlgorithmName.SHA256;
        private readonly string  delimiter = ":";

        internal string Hash(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(saltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, _hashAlgorithmName, keySize);
            return string.Join(delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));
            /*using (var sha256 = SHA256.Create())
            {
                var combinedBytes = Encoding.UTF8.GetBytes(password + Convert.ToBase64String(salt));
                var hash = sha256.ComputeHash(combinedBytes);
                return Convert.ToBase64String(salt.Concat(hash).ToArray());
            }*/

        }

        internal bool Verify(string hashHassword, string inputPassword)
        {
            var elemennts = hashHassword.Split(delimiter);
            var salt = Convert.FromBase64String(elemennts[0]);
            var hash = Convert.FromBase64String(elemennts[1]);
            var hashInput = Rfc2898DeriveBytes.Pbkdf2(inputPassword, salt, iterations, _hashAlgorithmName, keySize);

            return CryptographicOperations.FixedTimeEquals(hash, hashInput);

        }
    }
}
