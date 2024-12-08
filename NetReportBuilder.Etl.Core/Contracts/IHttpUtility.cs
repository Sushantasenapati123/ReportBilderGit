using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public interface IHttpUtility
    {
        Task<string> SendRequest(string apiUrl, string selectedMethod, string apiType, List<KeyValuePair<string, string>> tableData, string rawparam);
        Task<string> SendRequestnew(string apiUrl, string selectedMethod, string apiType, Dictionary<string, string> tableData, string rawparam);
    }
}
