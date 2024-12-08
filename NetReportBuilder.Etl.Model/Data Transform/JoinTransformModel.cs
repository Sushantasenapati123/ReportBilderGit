using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class JoinTransformModel
    {
        public List<SelectedColumnDetails> SelectedColumns { get; set; }
        public List<RelationModel> ListOfJoinConditions { get; set; }
        public string EntityName { get; set; }

    }
    public class RelationModel
    {
        public EntityKeyModel LeftTable { get; set; }
        public EntityKeyModel RightTable { get; set; }
        public string JoinType { get; set; }
    }
    public class EntityKeyModel
    {
        public string EntityName { get; set; }
        public string ColumnName { get; set; }
        

    }
    public class SelectedColumnDetails
    {
        public string EntityName { get; set; }
        public string ColumnName { get; set; }


    }
    public class DataTransformationResult
    {
        public DataTable Source { get; set; }
        public string SourceCode { get; set; }
        public string EntityName { get; set; }

        public string AccumulateSourceCode { get; set; }
    }



}
