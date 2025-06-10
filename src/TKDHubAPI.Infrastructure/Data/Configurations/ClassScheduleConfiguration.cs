namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class ClassScheduleConfiguration : BaseEntityConfiguration<ClassSchedule>
{
    public override void Configure(EntityTypeBuilder<ClassSchedule> builder)
    {
        base.Configure(builder);

        builder.ToTable("ClassSchedules");

        builder.Property(cs => cs.Day)
            .IsRequired();

        builder.Property(cs => cs.StartTime)
            .IsRequired();

        builder.Property(cs => cs.EndTime)
            .IsRequired();

        builder.HasOne(cs => cs.TrainingClass)
            .WithMany(tc => tc.Schedules)
            .HasForeignKey(cs => cs.TrainingClassId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
