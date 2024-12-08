using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetReportBuilder.Etl.Model
{
    public class CommonUtility
    {
        public static bool BeAValidUrl(string url)
        {
            Uri uriResult;
            bool result = Uri.TryCreate(url, UriKind.Absolute, out uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
            return result;
        }
        public static async Task<string> ReadTexFile(string filePath)
        {
            const Int32 BufferSize = 128;
            StringBuilder sb = new StringBuilder();
            using (var fileStream = File.OpenRead(filePath))
            {
                using (var streamReader = new StreamReader(fileStream, Encoding.UTF8, true, BufferSize))
                {
                    String line;
                    while ((line = await streamReader.ReadLineAsync()) != null)
                    {
                        sb.Append(line);
                    }
                }
            }
            return sb.ToString();
        }
    }
}
