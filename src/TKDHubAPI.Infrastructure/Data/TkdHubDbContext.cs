using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using TKDHubAPI.Domain.Constants;

namespace TKDHubAPI.Infrastructure.Data;

public class TkdHubDbContext : DbContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TkdHubDbContext(
        DbContextOptions<TkdHubDbContext> options,
        IHttpContextAccessor httpContextAccessor
    )
        : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
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
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<UserDojaang> UserDojaangs { get; set; }
    public DbSet<TrainingClass> TrainingClasses { get; set; }
    public DbSet<ClassSchedule> ClassSchedules { get; set; }
    public DbSet<StudentClass> StudentClasses { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<StudentClassAttendance> StudentClassAttendances { get; set; }
    public DbSet<DashboardLayout> DashboardLayouts { get; set; }
    public DbSet<Widget> Widgets { get; set; }

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

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var userIdClaim = _httpContextAccessor
            .HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
            ?.Value;
        int? userId = int.TryParse(userIdClaim, out var id) ? id : null;

        var auditEntries = new List<AuditLog>();
        var pendingAdded = new List<(EntityEntry Entry, AuditLog Audit)>();

        foreach (
            var entry in ChangeTracker
                .Entries()
                .Where(e =>
                    !(e.Entity is AuditLog)
                    && e.State != EntityState.Detached
                    && e.State != EntityState.Unchanged
                )
        )
        {
            var audit = new AuditLog
            {
                EntityName = entry.Entity.GetType().Name,
                Timestamp = now,
                UserId = userId?.ToString()
            };

            var key = entry.Metadata.FindPrimaryKey();
            object? entityId = null;
            if (key != null)
            {
                var keyProperty = key.Properties.FirstOrDefault();
                if (
                    keyProperty != null
                    && entry.Properties.Any(p => p.Metadata.Name == keyProperty.Name)
                )
                {
                    entityId = entry.Property(keyProperty.Name).CurrentValue;
                }
            }
            audit.EntityId = entityId as int?;

            switch (entry.State)
            {
                case EntityState.Added:
                    // Defer Added entries until after save so generated keys are available
                    audit.Operation = AuditOperation.Create;
                    audit.Changes = System.Text.Json.JsonSerializer.Serialize(
                        entry.CurrentValues.ToObject()
                    );
                    pendingAdded.Add((entry, audit));
                    break;
                case EntityState.Modified:
                    var original = entry.OriginalValues.ToObject();
                    var current = entry.CurrentValues.ToObject();

                    // Detect soft delete transitions via IsActive property
                    var isActiveProp = entry.Properties.FirstOrDefault(p =>
                        p.Metadata.Name == PropertyNames.IsActive
                    );
                    var isSoftDelete = false;
                    if (isActiveProp != null)
                    {
                        var originalIsActive =
                            entry.OriginalValues[PropertyNames.IsActive] as bool? ?? true;
                        var currentIsActive =
                            entry.CurrentValues[PropertyNames.IsActive] as bool? ?? true;
                        isSoftDelete = originalIsActive && !currentIsActive;
                    }

                    audit.Operation = isSoftDelete ? AuditOperation.Delete : AuditOperation.Update;
                    audit.Changes = System.Text.Json.JsonSerializer.Serialize(
                        new { Original = original, Current = current }
                    );
                    auditEntries.Add(audit);
                    break;
                case EntityState.Deleted:
                    audit.Operation = AuditOperation.Delete;
                    audit.Changes = System.Text.Json.JsonSerializer.Serialize(
                        entry.OriginalValues.ToObject()
                    );
                    auditEntries.Add(audit);
                    break;
            }
        }

        // Persist main changes first (this will generate keys for Added entities)
        var result = await base.SaveChangesAsync(cancellationToken);

        // Now finish pending added audits (we can read generated keys)
        foreach (var (entry, audit) in pendingAdded)
        {
            var key = entry.Metadata.FindPrimaryKey();
            if (key != null)
            {
                var keyProperty = key.Properties.FirstOrDefault();
                if (
                    keyProperty != null
                    && entry.Properties.Any(p => p.Metadata.Name == keyProperty.Name)
                )
                {
                    audit.EntityId = entry.Property(keyProperty.Name).CurrentValue as int?;
                }
            }

            // If we didn't already set Changes, set it now
            if (string.IsNullOrEmpty(audit.Changes))
                audit.Changes = System.Text.Json.JsonSerializer.Serialize(
                    entry.CurrentValues.ToObject()
                );

            auditEntries.Add(audit);
        }

        if (auditEntries.Any())
        {
            AuditLogs.AddRange(auditEntries);
            await base.SaveChangesAsync(cancellationToken);
        }

        return result;
    }
}
