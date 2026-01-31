using Microsoft.AspNetCore.Mvc;
using AuthService.Models;
using AuthService.Repositories;
using AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using AuthService.Utils;
using Google.Apis.Auth;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _repo;
        private readonly JwtService _jwt;

        public AuthController(UserRepository repo, JwtService jwt)
        {
            _repo = repo;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromForm] string username,
            [FromForm] string email,
            [FromForm] string password,
            [FromForm] string gender,
            [FromForm] string city,
            [FromForm] IFormFile? photo
        )
        {
            if (_repo.GetByEmail(email) != null)
                return BadRequest("User already exists");

            if (!PasswordValidator.IsValid(password))
                return BadRequest("Password must be strong");

            string? imageUrl = null;

            // If photo is uploaded
            if (photo != null && photo.Length > 0)
            {
                var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
                Directory.CreateDirectory(folder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";
                var filePath = Path.Combine(folder, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await photo.CopyToAsync(stream);

                imageUrl = $"/uploads/profiles/{fileName}";
            }

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Gender = gender,
                City = city,
                ProfileImageUrl = imageUrl,
                Role = "User"
            };

            _repo.Add(user);

            return Ok("User registered successfully");
        }


        [HttpPost("login")]
        public IActionResult Login(LoginRequest req)
        {
            var user = _repo.GetByEmail(req.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(user);

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Role,
                user.Gender,
                user.City,
                user.ProfileImageUrl,
                user.CreatedAt,
                token
            });
        }

        // Get user by email
        [HttpGet("user/by-email/{email}")]
        public IActionResult GetUserByEmail(string email)
        {
            var user = _repo.GetByEmail(email);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }

        // Get user by id
        [HttpGet("user/{id}")]
        public IActionResult GetUserById(string id)
        {
            var user = _repo.GetById(id);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }

        // Get user by username
        [HttpGet("user/by-name/{username}")]
        public IActionResult GetUserByUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest("Username query parameter is required");

            var user = _repo.GetByUsername(username);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            var user = _repo.GetByEmail(req.Email);

            if (user != null)
            {
                var token = Guid.NewGuid().ToString();

                user.ResetToken = token;
                user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);
                _repo.Update(user);

                var resetLink = $"http://localhost:5173/reset-password?token={token}";

                try
                {
                EmailService.Send(
                    user.Email,
                    "Reset your password",
                    $"Click this link to reset your password:\n\n{resetLink}"
                );
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Email failed: " + ex.Message);
                }
            }

            // Always return same message for security
            return Ok("If the email exists, a reset link has been sent.");
        }



        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordRequest req)
        {
            var user = _repo.GetByResetToken(req.Token);

            if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired token");

            if (!PasswordValidator.IsValid(req.NewPassword))
                return BadRequest("Weak password");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            _repo.Update(user);

            return Ok("Password reset successful");
        }

        // Update user profile (Edit + Save Changes)
        [Authorize]
        [HttpPut("user/{id}")]
        public IActionResult UpdateUser(string id, UpdateUserRequest req)
        {
            var user = _repo.GetById(id);

            if (user == null)
                return NotFound("User not found");

            user.Username = req.Username;
            user.Email = req.Email;
            user.Gender = req.Gender;
            user.City = req.City;

            _repo.Update(user);

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Gender,
                user.City,
                user.ProfileImageUrl,
                user.CreatedAt
            });

        }

        // delete account
        [Authorize]
        [HttpDelete("user/{id}")]
        public IActionResult DeleteUser(string id)
        {
            var user = _repo.GetById(id);

            if (user == null)
                return NotFound("User not found");

            _repo.Delete(id);

            return Ok("User deleted successfully");
        }

        [Authorize]
        [HttpPost("user/{id}/upload-photo")]
        public async Task<IActionResult> UploadProfilePhoto(string id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var user = _repo.GetById(id);
            if (user == null)
                return NotFound("User not found");

            var folderPath = Path.Combine("wwwroot", "uploads", "profiles");
            Directory.CreateDirectory(folderPath); // safety

            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{id}{fileExtension}";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"/uploads/profiles/{fileName}";

            user.ProfileImageUrl = imageUrl;
            _repo.Update(user);

            return Ok(new { imageUrl });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(GoogleLoginRequest req)
        {
            try
            {
                // 1. Verify token with Google
                var payload = await GoogleJsonWebSignature.ValidateAsync(req.Token);

                var email = payload.Email;
                var name = payload.Name;
                var picture = payload.Picture;

                // 2. Find user in MongoDB
                var user = _repo.GetByEmail(email);

                // 3. If user doesn't exist, create new
                if (user == null)
                {
                    user = new User
                    {
                        Email = email,
                        Username = name,
                        ProfileImageUrl = picture,
                        Role = "User"
                    };

                    _repo.Add(user);
                }

                // 4. Generate your own JWT
                var token = _jwt.GenerateToken(user);

                // 5. Send data to frontend
                return Ok(new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.Role,
                    user.Gender,
                    user.City,
                    user.ProfileImageUrl,
                    token
                });
            }
            catch
            {
                return Unauthorized("Invalid Google token");
            }
        }


    }
}
