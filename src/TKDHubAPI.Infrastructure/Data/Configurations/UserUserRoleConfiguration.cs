namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class UserUserRoleConfiguration : IEntityTypeConfiguration<UserUserRole>
{
    public void Configure(EntityTypeBuilder<UserUserRole> builder)
    {
        builder.ToTable("UserUserRoles");

        builder.HasKey(uur => new { uur.UserId, uur.UserRoleId });

        builder.HasOne(uur => uur.User)
            .WithMany(u => u.UserUserRoles)
            .HasForeignKey(uur => uur.UserId);

        builder.HasOne(uur => uur.UserRole)
            .WithMany(ur => ur.UserUserRoles)
            .HasForeignKey(uur => uur.UserRoleId);
    }
}



