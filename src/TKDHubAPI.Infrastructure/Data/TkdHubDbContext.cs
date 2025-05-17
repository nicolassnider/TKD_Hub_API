using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data;
public class TkdHubDbContext : DbContext
{
    public TkdHubDbContext(DbContextOptions<TkdHubDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Rank> Ranks { get; set; }
    // Add other DbSets here
}
