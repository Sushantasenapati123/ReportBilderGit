using Microsoft.Extensions.Caching.Memory;
namespace NetReportBuilder.ReportUI
{
    public class MemCache : IMemCache
    {
        private IMemoryCache _MemCache;
        public MemCache(IMemoryCache memCache)
        {
            _MemCache = memCache;
        }

        public T GetCache<T>(string cacheKey) where T : class
        {
            var val = default(T);
            if (_MemCache.TryGetValue<T>(cacheKey, out val))
            {
                return val;
            }
            return val;
        }
        public void SetCache<T>(T value, string cacheKey) where T : class
        {
            _MemCache.Set<T>(cacheKey, value, new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(5)));
        }
        public void SetCache<T>(T value, string cacheKey, DateTime expireTime) where T : class
        {
            _MemCache.Set<T>(cacheKey, value, new MemoryCacheEntryOptions().SetAbsoluteExpiration(expireTime));
        }
        public void RemoveCache(string cacheKey)
        {
            _MemCache.Remove(cacheKey);
        }

    }
}
