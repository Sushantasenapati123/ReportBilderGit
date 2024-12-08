using NetReportBuilder.ReportUI.IRepository.rep;
using NetReportBuilder.ReportUI.Factory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace NetReportBuilder.ReportUI.Repository
{
    /// <summary>
    /// Class RepositoryBase.
    /// </summary>    
    /// <seealso cref="FTP.Repository.Contract.IRepository" />
    public abstract class RepositoryBase : IRepo
    {
        /// <summary>
        /// Gets the connection.
        /// </summary>
        /// <value>The connection.</value>
        protected IDbConnection Connection;

        /// <summary>
        /// The disposed
        /// </summary>
        private bool _disposed;

        /// <summary>
        /// Initializes a new instance of the <see cref="RepositoryBase{TEntity}"/> class.
        /// </summary>
        /// <param name="connectionFactory">The connection factory.</param>
        protected RepositoryBase(IConnectionFactory connectionFactory)
        {
            try
            {
                Connection = connectionFactory.GetConnection;
                if (Connection.State == ConnectionState.Open)
                {
                    Connection.Close();
                }
                Connection.Open();
                //Not required to open the connection, it will automatically managed by DAPPER
                //Connection.Open();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        private void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    Connection?.Dispose();
                }
                _disposed = true;
            }
        }

        /// <summary>
        /// Finalizes an instance of the <see cref="RepositoryBase{TEntity}"/> class.
        /// </summary>
        ~RepositoryBase()
        {
            Dispose(false);
        }
    }

}
