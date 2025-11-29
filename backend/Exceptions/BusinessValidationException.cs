using Microsoft.AspNetCore.Http;

namespace CosmoRate.Api.Exceptions
{
    
    public class BusinessValidationException : ApiException
    {
        public BusinessValidationException(string message)
            : base(message, StatusCodes.Status400BadRequest)
        {
        }
    }
}
