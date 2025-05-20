using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class UserConfiguration : BaseEntityConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder); // Apply configurations from BaseEntity

        // Table Name (optional, EF Core usually infers this from the DbSet name)
        builder.ToTable("Users");

        // Primary Key is already configured in BaseEntity (assuming 'Id')

        // Properties and their configurations
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

        builder.Property(u => u.Role)
            .IsRequired()
            .HasConversion<string>();

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

        // Relationships (if any)

        builder.HasMany(u => u.TournamentRegistrations)
            .WithOne(tr => tr.Student)
            .HasForeignKey(tr => tr.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(u => u.Dojaang)
            .WithMany(d => d.Users)
            .HasForeignKey(u => u.DojaangId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(u => u.CurrentRank)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.CurrentRankId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

