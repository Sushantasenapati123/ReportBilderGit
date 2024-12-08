using Microsoft.AspNetCore.Http;
using NetReportBuilder.Etl.Business;
using NetReportBuilder.Etl.Core;
using NetReportBuilder.Etl.Model;
using NetReportBuilder.Etl.Web;
using Newtonsoft.Json;
using System.Data;

public static class SessionExtensions
{
    public static void SetObjectAsJson(this ISession session, string key, object value)
    {
        session.SetString(key, JsonConvert.SerializeObject(value));
    }

    public static T GetObjectFromJson<T>(this ISession session, string key)
    {
        var value = session.GetString(key);
        return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
    }
}

