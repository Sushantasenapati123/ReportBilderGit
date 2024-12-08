using NetReportBuilder.Etl.Model;

namespace NetReportBuilder.Etl.Web
{
    public interface ICustomCodeExecuter
    {
        Task<string> Execute(string cSharpCode);
    }
}
