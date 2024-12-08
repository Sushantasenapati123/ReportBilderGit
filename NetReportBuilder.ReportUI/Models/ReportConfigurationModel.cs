using System.Xml.Serialization;

namespace NetReportBuilder.ReportUI.Models
{
    public class ReportConfigurationModel
    {
        [XmlRoot(ElementName = "SubReport")]
        public class SubReport
        {

            [XmlElement(ElementName = "name")]
            public string Name { get; set; }

            [XmlElement(ElementName = "Icon")]
            public string Icon { get; set; }
        }

        [XmlRoot(ElementName = "ReportType")]
        public class ReportType
        {

            [XmlElement(ElementName = "name")]
            public string Name { get; set; }

            [XmlElement(ElementName = "SubReport")]
            public SubReport SubReport { get; set; }

            [XmlElement(ElementName = "SubReports")]
            public SubReports SubReports { get; set; }
        }

        [XmlRoot(ElementName = "SubReports")]
        public class SubReports
        {

            [XmlElement(ElementName = "SubReport")]
            public List<SubReport> SubReport { get; set; }
        }

        [XmlRoot(ElementName = "ReportTypes")]
        public class ReportTypes
        {

            [XmlElement(ElementName = "ReportType")]
            public List<ReportType> ReportType { get; set; }
        }
    }
}
