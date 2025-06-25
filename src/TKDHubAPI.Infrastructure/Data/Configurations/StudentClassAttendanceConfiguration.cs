namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class StudentClassAttendanceConfiguration : BaseEntityConfiguration<StudentClassAttendance>
{
    public override void Configure(EntityTypeBuilder<StudentClassAttendance> builder)
    {
        base.Configure(builder);

        builder.ToTable("StudentClassAttendances");

        builder.Property(a => a.Status)
            .IsRequired();

        builder.Property(a => a.Notes)
            .HasMaxLength(500);

        builder.HasOne(a => a.StudentClass)
            .WithMany()
            .HasForeignKey(a => a.StudentClassId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(a => a.StudentClassId);
    }
}
