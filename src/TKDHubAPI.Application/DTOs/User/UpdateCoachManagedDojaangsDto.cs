namespace TKDHubAPI.Application.DTOs.User;
public class UpdateCoachManagedDojaangsDto
{
    public int CoachId { get; set; }
    public List<int> ManagedDojaangIds { get; set; } = new();
}
