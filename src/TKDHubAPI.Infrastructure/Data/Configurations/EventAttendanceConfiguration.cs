namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class EventAttendanceConfiguration : BaseEntityConfiguration<EventAttendance>
{
    public override void Configure(EntityTypeBuilder<EventAttendance> builder)
    {
        base.Configure(builder); // Call the base class's Configure method

        // Table Name
        builder.ToTable("EventAttendances");

        // Primary Key is already configured in BaseEntityConfiguration

        // Properties Configuration
        builder.Property(ea => ea.EventId)
            .IsRequired();

        builder.Property(ea => ea.StudentId)
            .IsRequired();

        builder.Property(ea => ea.AttendanceDate)
            .IsRequired()
            .HasColumnType("datetime2");

        builder.Property(ea => ea.AttendanceTime)
            .IsRequired()
            .HasColumnType("time"); // Use time data type

        builder.Property(ea => ea.Status)
            .IsRequired()
            .HasConversion<string>(); // Store enum as string

        // Relationships Configuration

        // Relationship with Event
        builder.HasOne(ea => ea.Event)
            .WithMany(e => e.EventAttendances) // Assuming Event has this collection
            .HasForeignKey(ea => ea.EventId)
            .OnDelete(DeleteBehavior.NoAction);

        // Relationship with User (Student)
        builder.HasOne(ea => ea.Student)
            .WithMany(u => u.EventAttendances) // Assuming User has this collection
            .HasForeignKey(ea => ea.StudentId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}


