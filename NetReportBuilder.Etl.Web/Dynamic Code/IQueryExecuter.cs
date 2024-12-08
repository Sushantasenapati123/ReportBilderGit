using NetReportBuilder.Etl.Model;
using System.Data;

namespace NetReportBuilder.Etl.Web
{
    public interface IQueryExecuter
    {
        QueryResponce Execute(QueryRequest queryParams);
    }
   
}
