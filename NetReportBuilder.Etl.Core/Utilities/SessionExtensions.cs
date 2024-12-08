using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using NetReportBuilder.Etl.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public static class SessionExtensions
    {
       
        public static void Put<T>(this ISession session, T value) where T : class
        {
        }

        public static void Put<T>(this ISession session, string key, T value) where T : class
        {
            session.SetString(typeof(T).FullName + key, JsonConvert.SerializeObject(value));
        }

        public static T Get<T>(this ISession session) where T : class
        {

            var sesionValue = session.GetString(typeof(T).FullName);
            return string.IsNullOrEmpty(sesionValue) ? null : JsonConvert.DeserializeObject<T>(sesionValue);
        }

        public static T Get<T>(this ISession session, string key) where T : class
        {
            var sesionValue = session.GetString(typeof(T).FullName + key);
            return string.IsNullOrEmpty(sesionValue) ? null : JsonConvert.DeserializeObject<T>(sesionValue);
        }
        public static string Fetch(this ISession session, string key)
        {
            byte[] byteArray;
            if (session.TryGetValue(key, out byteArray))
            {
                return System.Text.Encoding.UTF8.GetString(byteArray);
            }
            return string.Empty;
        }

     
        
    }
}
