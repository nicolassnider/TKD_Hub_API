using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data;
public class TkdHubDbContext : DbContext
{
    public TkdHubDbContext(DbContextOptions<TkdHubDbContext> options) : base(options) { }

    public DbSet<Dojaang> Dojaangs { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<EventAttendance> EventAttendances { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<Promotion> Promotions { get; set; }
    public DbSet<Rank> Ranks { get; set; }
    public DbSet<Technique> Techniques { get; set; }
    public DbSet<Tournament> Tournaments { get; set; }
    public DbSet<TournamentRegistration> TournamentRegistrations { get; set; }
    public DbSet<Tul> Tuls { get; set; }
    public DbSet<TulTechnique> TulTechniques { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TkdHubDbContext).Assembly);
    }


}
