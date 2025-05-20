using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class TournamentRegistrationConfiguration : IEntityTypeConfiguration<TournamentRegistration>
{
    public void Configure(EntityTypeBuilder<TournamentRegistration> builder)
    {
        // Table Name
        builder.ToTable("TournamentRegistrations");

        // Primary Key
        builder.HasKey(tr => tr.Id);

        // Properties Configuration
        builder.Property(tr => tr.TournamentId)
            .IsRequired();

        builder.Property(tr => tr.StudentId)
            .IsRequired();

        builder.Property(tr => tr.RegistrationDate)
            .IsRequired()
            .HasColumnType("datetime2"); // Use datetime2 for better precision

        builder.Property(tr => tr.Category)
            .IsRequired()
            .HasMaxLength(255); // Set a reasonable max length

        builder.Property(tr => tr.Status)
            .IsRequired()
            .HasConversion<string>(); // Store the enum as a string

        // Relationships Configuration

        // Relationship with Tournament
        builder.HasOne(tr => tr.Tournament)
            .WithMany(t => t.Registrations) // Use the collection name from Tournament.cs
            .HasForeignKey(tr => tr.TournamentId)
            .OnDelete(DeleteBehavior.NoAction); // Or other appropriate behavior

        // Relationship with User (Student)
        builder.HasOne(tr => tr.Student)
            .WithMany(s => s.TournamentRegistrations) // Use the collection name from User.cs
            .HasForeignKey(tr => tr.StudentId)
            .OnDelete(DeleteBehavior.NoAction);     // Or other appropriate behavior
    }
}
