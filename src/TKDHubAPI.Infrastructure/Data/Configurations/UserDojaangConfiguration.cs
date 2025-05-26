namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class UserDojaangConfiguration : IEntityTypeConfiguration<UserDojaang>
{
    public void Configure(EntityTypeBuilder<UserDojaang> builder)
    {
        builder.HasKey(ud => new { ud.UserId, ud.DojaangId });

        builder.Property(ud => ud.Role)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasOne(ud => ud.User)
            .WithMany(u => u.UserDojaangs)
            .HasForeignKey(ud => ud.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ud => ud.Dojaang)
            .WithMany(d => d.UserDojaangs)
            .HasForeignKey(ud => ud.DojaangId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable("UserDojaangs");
    }
}

