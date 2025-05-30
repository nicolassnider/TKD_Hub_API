namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class UserConfiguration : BaseEntityConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder);

        builder.ToTable("Users");

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);
        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .IsRequired();

        builder.Property(u => u.DateOfBirth)
            .IsRequired(false);

        builder.Property(u => u.Gender)
            .IsRequired(false)
            .HasConversion<string>();

        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(u => u.DojaangId)
            .IsRequired(false);

        builder.Property(u => u.CurrentRankId)
            .IsRequired(false);

        builder.Property(u => u.JoinDate)
            .IsRequired()
            .HasColumnType("datetime2");

        // Many-to-many: User <-> UserRole via UserUserRole
        builder
            .HasMany(u => u.UserUserRoles)
            .WithOne(uur => uur.User)
            .HasForeignKey(uur => uur.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
