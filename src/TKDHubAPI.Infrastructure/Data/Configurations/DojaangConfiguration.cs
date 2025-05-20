using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class DojangConfiguration : BaseEntityConfiguration<Dojaang>
{
    public override void Configure(EntityTypeBuilder<Dojaang> builder)
    {
        base.Configure(builder); // Call the base class's Configure method

        builder.ToTable("Dojangs"); // Explicitly set table name

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(d => d.Address)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(d => d.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(d => d.Email)
            .HasMaxLength(255);

        builder.Property(d => d.KoreanName)
            .HasMaxLength(100);

        builder.Property(d => d.KoreanNamePhonetic)
            .HasMaxLength(100);

        // Configure the relationship with User (Coach)
        builder.HasOne(d => d.Coach)
            .WithOne() //  Use WithOne() because a User is the Coach of only one Dojang
            .HasForeignKey<Dojaang>(d => d.CoachId) // Specify the foreign key in Dojang
            .OnDelete(DeleteBehavior.NoAction) //  ON DELETE NO ACTION
            .HasConstraintName("FK_Dojangs_Users_CoachId"); // Explicitly name the constraint

        // Configure the relationship with Users (students)
        builder.HasMany(d => d.Users)
            .WithOne(u => u.Dojaang)
            .HasForeignKey(u => u.DojaangId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

