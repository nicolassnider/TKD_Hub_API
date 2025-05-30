namespace TKDHubAPI.Domain.Entities;

public class AuditLog
{
    public int Id { get; set; }
    public int? EntityId { get; set; }
    public AuditOperation Operation { get; set; }
    public string? UserId { get; set; }
    public DateTime Timestamp { get; set; }
    public string? Changes { get; set; }
    public string EntityName { get; set; } = string.Empty;
}
