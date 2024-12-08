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
  
  


    public class PipelineConfiguration<T> where T:BaseConfiguration
    {
        public PipelineConfiguration()
        {
            PipelineCodes = new StringBuilder();
        }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
        public string DataSourceType { get; set; }
        public T DataConfiguration { get; set; }
        public DataMappingConfiguration DataMappingConfigurationDetails { get; set; }
        public StringBuilder PipelineCodes { get; set; }
    }

   
   







}
