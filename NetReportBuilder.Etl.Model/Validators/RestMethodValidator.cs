using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model.Validators
{
    public class RestMethodValidator : AbstractValidator<RestMethodParameterModel>
    {
        public RestMethodValidator()
        {
            RuleFor(p => p.ApiUrl)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("{PropertyName} should be not empty.")
                .Must(CommonUtility.BeAValidUrl).WithMessage("Invalid URL format.");

            RuleFor(p => p.SelectedMethod)
              .Cascade(CascadeMode.StopOnFirstFailure)
              .NotEmpty().WithMessage("{PropertyName} should be not empty.");           
        }
    }

}
