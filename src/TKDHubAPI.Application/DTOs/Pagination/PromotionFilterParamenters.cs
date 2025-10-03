namespace TKDHubAPI.Application.DTOs.Pagination;

public class PromotionFilterParameters : QueryParameters
{
    public int? StudentId { get; set; }
    public int? FromRankId { get; set; }
    public int? ToRankId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int? DojaangId { get; set; }
}
