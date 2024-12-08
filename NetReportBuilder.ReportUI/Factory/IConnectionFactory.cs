using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace NetReportBuilder.ReportUI.Factory
{
    /// <summary>
    /// Interface IConnectionFactory
    /// </summary>
    public interface IConnectionFactory
    {
        /// <summary>
        /// Gets the get connection.
        /// </summary>
        /// <value>The get connection.</value>
        IDbConnection GetConnection { get; }
    }
}
