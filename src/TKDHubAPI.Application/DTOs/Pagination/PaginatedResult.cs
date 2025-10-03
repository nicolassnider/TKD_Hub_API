
namespace TKDHubAPI.Application.DTOs.Pagination;

public class PaginatedResult<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    
    // Additional pagination metadata
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalCount / PageSize) : 0;
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
    public int? NextPage => HasNextPage ? Page + 1 : null;
    public int? PreviousPage => HasPreviousPage ? Page - 1 : null;
}
