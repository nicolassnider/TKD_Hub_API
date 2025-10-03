namespace TKDHubAPI.Application.DTOs.Pagination;

public enum SortDirection
{
    Ascending = 0,
    Descending = 1
}

public class SortParameter
{
    public string Property { get; set; } = string.Empty;
    public SortDirection Direction { get; set; } = SortDirection.Ascending;
    
    public SortParameter() { }
    
    public SortParameter(string property, SortDirection direction = SortDirection.Ascending)
    {
        Property = property;
        Direction = direction;
    }
}

public class QueryParameters
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;
    public string? SortBy { get; set; }
    public SortDirection SortDirection { get; set; } = SortDirection.Ascending;
    
    // Helper method to parse sort parameter
    public SortParameter? GetSortParameter()
    {
        if (string.IsNullOrWhiteSpace(SortBy))
            return null;
            
        return new SortParameter(SortBy, SortDirection);
    }
}
