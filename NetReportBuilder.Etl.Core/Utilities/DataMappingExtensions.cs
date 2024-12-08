using NetReportBuilder.Etl.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Core
{
    public static class DataMappingExtensions
    {
        public static DataColumn Clone(this DataColumn source)
        {
            DataColumn clone = new DataColumn(source.ColumnName, source.DataType)
            {
                AllowDBNull = source.AllowDBNull,
                Caption = source.Caption,
                DefaultValue = source.DefaultValue,
                MaxLength = source.MaxLength,
                ReadOnly = source.ReadOnly,
                Unique = source.Unique
            };

            // Copy extended properties if any
            foreach (var key in source.ExtendedProperties.Keys)
            {
                clone.ExtendedProperties[key] = source.ExtendedProperties[key];
            }

            return clone;
        }
        public static DataTable GenerateDestination(this DataTable source,List<MappingModel> mapping, string[] columns)
        {
            var destination = new DataTable();
            foreach (var field in columns)
            {
                var sourceColumn = mapping.FirstOrDefault(column =>
                column.DestinationColumn.ToLower() == field.ToLower())
                .SourceColumn.ParseToText();
                if (sourceColumn is not null)
                {
                    var baseColumn = source.Columns[sourceColumn];
                    var dc = baseColumn.Clone();
                    dc.ColumnName = field;
                    destination.Columns.Add(dc);
                }
            }
            destination = source.FillSourceToDestination(mapping, destination);
            return destination;
        }
        public static DataTable GenerateDestinationSchema(this DataMappingConfiguration dataMapping, DataTable source)
        {
            var destination = new DataTable();
            foreach (var field in dataMapping.Destination.AsEnumerable())
            {

                var sourceColumn = dataMapping.MappingDetails.
                    FirstOrDefault(column => column.DestinationColumn.ToLower() == field.ColumnName.ToLower())
                    .SourceColumn.ParseToText();
                if (sourceColumn is not null)
                {
                    var baseColumn = source.Columns[sourceColumn];
                    var dc = baseColumn.Clone();
                    dc.ColumnName = field.ColumnName;
                    destination.Columns.Add(dc);
                }
            }
            return destination;
        }
        public static DataTable FillSourceToDestination(this DataTable source, List<MappingModel> mappings, DataTable destination)
        {
            foreach (DataRow dr in source.Rows)
            {
                var newRow = destination.NewRow();
                foreach (var mapping in mappings)
                {
                    newRow[mapping.DestinationColumn] = dr[mapping.SourceColumn] ?? DBNull.Value;
                }
                destination.Rows.Add(newRow);
            }
            return destination;
        }
    }
}
