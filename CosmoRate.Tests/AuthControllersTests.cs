using System.Threading.Tasks;
using CosmoRate.Api.Controllers;
using CosmoRate.Api.DTOs;
using CosmoRate.Api.Services;
using CosmoRate.Api.Exceptions;
using CosmoRate.Api.Models;  
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CosmoRate.Tests
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly Mock<ILogService> _logServiceMock;

        public AuthControllerTests()
        {
            _authServiceMock = new Mock<IAuthService>();
            _logServiceMock = new Mock<ILogService>();
        }

        
        [Fact]
        public async Task Register_WithValidData_ShouldReturnCreated()
        {
            
            var dto = new AuthRegisterDto
            {
                Email = "test@example.com",
                Password = "Password123!",
                Username= "User123"
            };

            var user = new User
            {
                Id = 1,
                Email = dto.Email,
                Role = "User"
            };

            _authServiceMock
                .Setup(s => s.RegisterAsync(dto))
                .ReturnsAsync((true, (string?)null, user));

            var controller = new AuthController(_authServiceMock.Object, _logServiceMock.Object);

            
            var result = await controller.Register(dto);

            
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.NotNull(createdResult.Value);
        }

       
        [Fact]
        public async Task Login_WithInvalidCredentials_ShouldThrowUnauthorizedAccessException()
        {
            
            var dto = new AuthLoginDto
            {
                Email = "wrong@example.com",
                Password = "badpassword"
            };

            _authServiceMock
                .Setup(s => s.LoginAsync(dto))
                .ReturnsAsync((false, "Invalid credentials", (string?)null));

            var controller = new AuthController(_authServiceMock.Object, _logServiceMock.Object);

            
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => controller.Login(dto));
        }
    }
}
