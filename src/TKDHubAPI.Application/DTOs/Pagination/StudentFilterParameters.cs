namespace TKDHubAPI.Application.DTOs.Pagination;

public class StudentFilterParameters : QueryParameters
{
    public int? ExcludeClassId { get; set; }
    public int? DojaangId { get; set; }
    public string? SearchTerm { get; set; }
    public bool? IsActive { get; set; }
    public int? RankId { get; set; }
}
