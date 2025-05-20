using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class TournamentConfiguration : IEntityTypeConfiguration<Tournament>
{
    public void Configure(EntityTypeBuilder<Tournament> builder)
    {
        // Table Name
        builder.ToTable("Tournaments");

        // Primary Key
        builder.HasKey(t => t.Id);

        // Properties Configuration
        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(255); // Set a reasonable max length

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(1000); // Or an appropriate length

        builder.Property(t => t.StartDate)
            .IsRequired()
            .HasColumnType("datetime2");

        builder.Property(t => t.EndDate)
            .IsRequired()
            .HasColumnType("datetime2");

        builder.Property(t => t.Location)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(t => t.Organizer)
            .IsRequired()
            .HasMaxLength(255);

        // Relationships Configuration
        // Relationship with TournamentRegistration
        builder.HasMany(t => t.Registrations)
            .WithOne(tr => tr.Tournament)
            .HasForeignKey(tr => tr.TournamentId)
            .OnDelete(DeleteBehavior.NoAction); // Or other appropriate behavior
    }
}
