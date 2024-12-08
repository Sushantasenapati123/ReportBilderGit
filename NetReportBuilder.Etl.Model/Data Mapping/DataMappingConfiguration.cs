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
    public class DataMappingConfiguration
    {
        public DataMappingConfiguration()
        {
            this.TargetTable = string.Empty;
            Source = new List<Source>();
            Destination = new List<Destination>();
            MappingDetails = new List<MappingModel>();
            SourceCode = string.Empty;
            DataSyncModes = string.Empty;
        }


        public string DataSyncModes { get; set; }
        public string TargetTable { get; set; }
        public List<Source> Source { get; set; }
        public List<Destination> Destination { get; set; }
        public List<MappingModel> MappingDetails {get;set;}
        public string SourceCode { get; set; }
    }
    

}
