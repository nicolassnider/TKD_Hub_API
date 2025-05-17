using System.ComponentModel.DataAnnotations;

namespace TKDHubAPI.Domain.Entities;
public class Rank
{
    public int Id { get; set; }
    [Required, MaxLength(50)]
    public string Name { get; set; }
    public int Order { get; set; }
    public string Description { get; set; }
}