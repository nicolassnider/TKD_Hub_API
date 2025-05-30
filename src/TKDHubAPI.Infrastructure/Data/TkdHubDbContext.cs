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
                    // Don't add to auditEntries yet, wait until after SaveChanges
                    break;
                case EntityState.Modified:
                    audit.Operation = AuditOperation.Update;
                    audit.Changes = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        Original = entry.OriginalValues.ToObject(),
                        Current = entry.CurrentValues.ToObject()
                    });
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
