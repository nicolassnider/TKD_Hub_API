using Microsoft.Extensions.Options;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.Settings;

namespace TKDHubAPI.Application.Services;

public class PaginationService<T> : IPaginationService<T>
{
    private readonly PaginationSettings _settings;

    public PaginationService(IOptions<PaginationSettings> options)
    {
        _settings = options.Value;
    }
    public async Task<PaginatedResult<T>> PaginateAsync(IEnumerable<T> source, int page, int pageSize)
    {
        var effectivePageSize = pageSize > 0
            ? Math.Min(pageSize, _settings.MaxPageSize)
            : _settings.DefaultPageSize;

        var items = source.Skip((page - 1) * effectivePageSize).Take(effectivePageSize).ToList();
        var totalCount = source.Count();

        return await Task.FromResult(new PaginatedResult<T>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = effectivePageSize
        });
    }
}
