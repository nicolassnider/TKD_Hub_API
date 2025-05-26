namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class DojaangConfiguration : BaseEntityConfiguration<Dojaang>
{
    public override void Configure(EntityTypeBuilder<Dojaang> builder)
    {
        base.Configure(builder);

        builder.ToTable("Dojaangs");

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(d => d.Address)
            .HasMaxLength(300);

        builder.Property(d => d.Location)
            .HasMaxLength(300);

        builder.Property(d => d.PhoneNumber)
            .HasMaxLength(30);

        builder.Property(d => d.Email)
            .HasMaxLength(100);

        builder.Property(d => d.KoreanName)
            .HasMaxLength(200);

        builder.Property(d => d.KoreanNamePhonetic)
            .HasMaxLength(200);

        // Coach (optional, single coach per dojaang)
        builder.HasOne(d => d.Coach)
            .WithMany() // No navigation property on User for DojaangsCoached
            .HasForeignKey(d => d.CoachId)
            .OnDelete(DeleteBehavior.SetNull);

        // Users (many-to-one: User -> Dojaang)
        builder.HasMany(d => d.Users)
            .WithOne(u => u.Dojaang)
            .HasForeignKey(u => u.DojaangId)
            .OnDelete(DeleteBehavior.SetNull);

        // Events (one-to-many: Dojaang -> Events)
        builder.HasMany(d => d.Events)
            .WithOne(e => e.Dojaang)
            .HasForeignKey(e => e.DojaangId)
            .OnDelete(DeleteBehavior.SetNull);

        // Tournaments (one-to-many: Dojaang -> Tournaments)
        builder.HasMany(d => d.Tournaments)
            .WithOne(t => t.Dojaang)
            .HasForeignKey(t => t.DojaangId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}


