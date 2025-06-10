namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class TrainingClassConfiguration : BaseEntityConfiguration<TrainingClass>
{
    public override void Configure(EntityTypeBuilder<TrainingClass> builder)
    {
        base.Configure(builder);

        builder.ToTable("TrainingClasses");

        builder.Property(tc => tc.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasOne(tc => tc.Dojaang)
            .WithMany()
            .HasForeignKey(tc => tc.DojaangId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(tc => tc.Coach)
            .WithMany()
            .HasForeignKey(tc => tc.CoachId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(tc => tc.Schedules)
            .WithOne(cs => cs.TrainingClass)
            .HasForeignKey(cs => cs.TrainingClassId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(tc => tc.StudentClasses)
            .WithOne(sc => sc.TrainingClass)
            .HasForeignKey(sc => sc.TrainingClassId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

