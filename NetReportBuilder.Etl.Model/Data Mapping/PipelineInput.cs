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
  
    public class PipelineInput
    {
        public string PipelineName { get; set; }
        public string PipelineType { get; set; }
        public string PipelineConfiguration { get; set; }
    }


   

}
