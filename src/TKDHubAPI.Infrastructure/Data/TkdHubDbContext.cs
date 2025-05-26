using Microsoft.Extensions.Options;
using TKDHubAPI.Application.Settings;

namespace TKDHubAPI.Infrastructure.Data;
public class TkdHubDbContext : DbContext
{
    private readonly IOptions<DojaangSettings> _dojaangSettings;
    private readonly IOptions<GrandMasterSettings> _grandMasterSettings;

    public TkdHubDbContext(
        DbContextOptions<TkdHubDbContext> options,
        IOptions<DojaangSettings> dojaangSettings,
        IOptions<GrandMasterSettings> grandMasterSettings
    ) : base(options)
    {
        _dojaangSettings = dojaangSettings;
        _grandMasterSettings = grandMasterSettings;
    }

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
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<UserUserRole> UserUserRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TkdHubDbContext).Assembly);

        // Seed initial Values using settings
        modelBuilder.Entity<Rank>().HasData(SeedData.GetRanks());
        modelBuilder.Entity<User>().HasData(SeedData.GetUsers());
        modelBuilder.Entity<Dojaang>().HasData(SeedData.GetDojaangs());
        modelBuilder.Entity<UserRole>().HasData(SeedData.GetUserRoles());
        modelBuilder.Entity<UserUserRole>().HasData(SeedData.GetUserUserRoles());
        modelBuilder.Entity<UserDojaang>().HasData(SeedData.GetUserDojaangs());
        modelBuilder.Entity<Tul>().HasData(SeedData.GetTuls());
    }
}

