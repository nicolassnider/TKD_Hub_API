using TKDHubAPI.Application.DTOs.Pagination;

namespace TKDHubAPI.Application.Interfaces;

public interface IPaginationService<T>
{
    Task<PaginatedResult<T>> PaginateAsync(IEnumerable<T> source, int page, int pageSize);
}
