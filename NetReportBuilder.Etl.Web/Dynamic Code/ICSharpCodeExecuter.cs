using NetReportBuilder.Etl.Model;

namespace NetReportBuilder.Etl.Web
{
    public interface ICSharpCodeExecuter
    {
        Task<Response> Execute(CustomCodeConfiguration queryParams);
    }
}
