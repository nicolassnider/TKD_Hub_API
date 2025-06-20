﻿namespace TKDHubAPI.Domain.Entities;
public partial class EventAttendance : BaseEntity
{
    public int EventId { get; set; }
    public int StudentId { get; set; }
    public DateTime AttendanceDate { get; set; }
    public TimeSpan AttendanceTime { get; set; }
    public AttendanceStatus Status { get; set; }

    // Navigation properties
    public Event Event { get; set; } = null!;
    public User Student { get; set; } = null!;
}
