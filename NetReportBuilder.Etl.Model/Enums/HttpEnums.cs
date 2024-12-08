namespace NetReportBuilder.Etl.Core
{
    public enum MethodType
    {
        GET,
        POST,
        DELETE,
        PUT,
    }
    public enum AuthenticationMode
    {
        BASIC,
        JWT,
    }
    public enum ParameterType
    {
        NoParameters,
        QueryParams,
        UrlParams,
        x_www_form_urlencoded,
        Raw,
        FormData,
    }
}