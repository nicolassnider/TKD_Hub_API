using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class UserUserRoleConfiguration : IEntityTypeConfiguration<UserUserRole>
{
    public void Configure(EntityTypeBuilder<UserUserRole> builder)
    {
        builder.HasKey(uur => new { uur.UserId, uur.UserRoleId });

        builder.HasOne(uur => uur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(uur => uur.UserId);

        builder.HasOne(uur => uur.UserRole)
            .WithMany(ur => ur.UserUsers)
            .HasForeignKey(uur => uur.UserRoleId);
    }
}
