using System.Linq;
using CosmoRate.Api.DTOs;
using Xunit;

namespace CosmoRate.Tests
{
    public class DtoValidationTests
    {
        // 1. Poprawny CreateProductDto jest OK
        [Fact]
        public void CreateProductDto_WithValidData_ShouldBeValid()
        {
            var dto = new CreateProductDto
            {
                Name = "Test product",
                Brand = "Test brand",
                CategoryId = 1,
                ImageUrl = "https://example.com/img.jpg"
            };

            var results = ValidationHelper.ValidateObject(dto);

            Assert.Empty(results);
        }

        // 2. Pusty Name powoduje błąd [Required]
        [Fact]
        public void CreateProductDto_EmptyName_ShouldFailValidation()
        {
            var dto = new CreateProductDto
            {
                Name = "",
                Brand = "Brand",
                CategoryId = 1
            };

            var results = ValidationHelper.ValidateObject(dto);

            Assert.Contains(results, r => r.MemberNames.Contains("Name"));
        }

        // 3. Rating poza zakresem 1–5 powoduje błąd
        [Fact]
        public void CreateReviewDto_RatingOutOfRange_ShouldFailValidation()
        {
            var dto = new CreateReviewDto
            {
                ProductId = 1,
                Rating = 10,              // za duży
                Title = "Ok",
                Body = "Ok body"
            };

            var results = ValidationHelper.ValidateObject(dto);

            Assert.Contains(results, r => r.MemberNames.Contains("Rating"));
        }
    }
}
