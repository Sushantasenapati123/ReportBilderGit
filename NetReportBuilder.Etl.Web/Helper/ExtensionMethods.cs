using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.Data;
using System.Text;
using NetReportBuilder.Etl.Core;
namespace NetReportBuilder.Etl.Web.Helper
{
    public static class ExtensionMethods
    {

        public static DataTable ConvertExcelToDataTable(this IFormFile file)
        {
            DataTable dataTable = new DataTable();
            using (var stream = new MemoryStream())
            {
                file.CopyTo(stream);
                stream.Position = 0;

                IWorkbook workbook = new XSSFWorkbook(stream); // For .xlsx files
                // For .xls files, use HSSFWorkbook
                // HSSFWorkbook workbook = new HSSFWorkbook(stream);

                ISheet sheet = workbook.GetSheetAt(0); // Assuming data is in the first sheet


                // Add columns to DataTable
                IRow headerRow = sheet.GetRow(0);
                if (headerRow != null)
                {
                    for (int i = 0; i < headerRow.LastCellNum; i++)
                    {
                        dataTable.Columns.Add(headerRow.GetCell(i)?.ToString());
                    }
                }

                // Add rows to DataTable
                for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++)
                {
                    IRow row = sheet.GetRow(i);
                    if (row == null) continue;

                    DataRow dataRow = dataTable.NewRow();
                    for (int j = row.FirstCellNum; j < headerRow.LastCellNum; j++)
                    {
                        if (row.GetCell(j) != null)
                        {
                            dataRow[j] = row.GetCell(j).ToString();
                        }
                    }
                    dataTable.Rows.Add(dataRow);
                }


            }


            return dataTable;
        }
    }
}
