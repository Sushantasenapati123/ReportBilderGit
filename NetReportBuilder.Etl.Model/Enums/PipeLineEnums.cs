namespace NetReportBuilder.Etl.Model
{
    public enum DataSourceType
    {
        API,RDBMS,FILE,CUSTOMCODE, APICUSTOMCODE
    }

    public enum DataSyncModes
    {
        //Merge,
        New,
    }
    public enum DataSourceTypes
    {
        API,
        RDBMS,
        File,
    }
}

