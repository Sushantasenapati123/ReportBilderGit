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

    public class MappingModel
    {
        public MappingModel()
        {
            this.SourceColumn = this.DestinationColumn = string.Empty;
        }
        public string SourceColumn { get; set; }
        public string DestinationColumn { get; set; }
       

    }
    

}
