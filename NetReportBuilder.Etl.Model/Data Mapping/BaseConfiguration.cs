using NetReportBuilder.Etl.Web.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    //ommented by Klayan
    public class BaseConfiguration
    {
        public virtual string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
   

}
