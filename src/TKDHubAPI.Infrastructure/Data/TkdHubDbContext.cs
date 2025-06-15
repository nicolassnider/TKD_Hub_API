using Microsoft.AspNetCore.Http;

namespace TKDHubAPI.Infrastructure.Data;
public class TkdHubDbContext : DbContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TkdHubDbContext(
        DbContextOptions<TkdHubDbContext> options,
        IHttpContextAccessor httpContextAccessor
    ) : base(options)
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
        var auditEntries = new List<AuditLog>();
        var now = DateTime.UtcNow;
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        int? userId = int.TryParse(userIdClaim, out var id) ? id : null;

        // Collect audit logs for Update and Delete (EntityId is available)
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                continue;

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
                if (keyProperty != null)
                {
                    entityId = entry.Property(keyProperty.Name).CurrentValue;
                }
            }
            audit.EntityId = entityId as int?;

            switch (entry.State)
            {
                case EntityState.Added:
                    audit.Operation = AuditOperation.Create;
                    audit.Changes = System.Text.Json.JsonSerializer.Serialize(entry.CurrentValues.ToObject());
                    break;
                case EntityState.Modified:
                    var original = entry.OriginalValues.ToObject();
                    var current = entry.CurrentValues.ToObject();
                    var isSoftDelete = false;

                    // Check for IsActive property (soft delete: true -> false)
                    var isActiveProp = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "IsActive");
                    if (isActiveProp != null)
                    {
                        var originalIsActive = entry.OriginalValues["IsActive"] as bool? ?? true;
                        var currentIsActive = entry.CurrentValues["IsActive"] as bool? ?? true;
                        isSoftDelete = originalIsActive && !currentIsActive;
                    }

                    if (isSoftDelete)
                    {
                        audit.Operation = AuditOperation.Delete;
                        audit.Changes = System.Text.Json.JsonSerializer.Serialize(new
                        {
                            Original = original,
                            Current = current
                        });
                    }
                    else
                    {
                        audit.Operation = AuditOperation.Update;
                        audit.Changes = System.Text.Json.JsonSerializer.Serialize(new
                        {
                            Original = original,
                            Current = current
                        });
                    }
                    auditEntries.Add(audit);
                    break;
                case EntityState.Deleted:
                    audit.Operation = AuditOperation.Delete;
                    audit.Changes = System.Text.Json.JsonSerializer.Serialize(entry.OriginalValues.ToObject());
                    auditEntries.Add(audit);
                    break;
            }
        }

        // Save changes to get generated keys
        var result = await base.SaveChangesAsync(cancellationToken);

        // Now handle Added entries (EntityId is available)
        foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Unchanged))
        {
            if (entry.Entity is AuditLog)
                continue;

            var audit = new AuditLog
            {
                EntityName = entry.Entity.GetType().Name,
                Timestamp = now,
                UserId = userId?.ToString(),
                Operation = AuditOperation.Create,
                Changes = System.Text.Json.JsonSerializer.Serialize(entry.CurrentValues.ToObject())
            };

            var key = entry.Metadata.FindPrimaryKey();
            object? entityId = null;
            if (key != null)
            {
                var keyProperty = key.Properties.FirstOrDefault();
                if (keyProperty != null)
                {
                    entityId = entry.Property(keyProperty.Name).CurrentValue;
                }
            }
            audit.EntityId = entityId as int?;
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
