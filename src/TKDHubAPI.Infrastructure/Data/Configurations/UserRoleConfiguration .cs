namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRoles");

        builder.HasKey(ur => ur.Id);

        builder.Property(ur => ur.Name)
            .IsRequired()
            .HasMaxLength(100);

        // Many-to-many: UserRole <-> User via UserUserRole
        builder
            .HasMany(ur => ur.UserUserRoles)
            .WithOne(uur => uur.UserRole)
            .HasForeignKey(uur => uur.UserRoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
