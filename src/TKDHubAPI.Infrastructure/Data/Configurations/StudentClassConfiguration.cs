namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class StudentClassConfiguration : BaseEntityConfiguration<StudentClass>
{
    public override void Configure(EntityTypeBuilder<StudentClass> builder)
    {
        base.Configure(builder);

        builder.ToTable("StudentClasses");

        builder.Property(sc => sc.Date)
            .IsRequired();

        builder.Property(sc => sc.Attended)
            .IsRequired();

        builder.HasOne(sc => sc.Student)
            .WithMany()
            .HasForeignKey(sc => sc.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(sc => sc.TrainingClass)
            .WithMany(tc => tc.StudentClasses)
            .HasForeignKey(sc => sc.TrainingClassId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
