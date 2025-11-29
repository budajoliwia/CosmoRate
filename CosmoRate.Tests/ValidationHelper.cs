using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CosmoRate.Tests
{
    public static class ValidationHelper
    {
        public static IList<ValidationResult> ValidateObject(object model)
        {
            var results = new List<ValidationResult>();
            var context = new ValidationContext(model, null, null);
            Validator.TryValidateObject(model, context, results, validateAllProperties: true);
            return results;
        }
    }
}
