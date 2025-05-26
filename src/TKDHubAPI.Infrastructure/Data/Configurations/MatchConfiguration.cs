namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class MatchConfiguration : BaseEntityConfiguration<Match>
{
    public override void Configure(EntityTypeBuilder<Match> builder)
    {
        base.Configure(builder);

        builder.ToTable("Matches");

        // Red Corner Student
        builder.HasOne(m => m.RedCornerStudent)
            .WithMany(u => u.MatchesAsRedCorner)
            .HasForeignKey(m => m.RedCornerStudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Blue Corner Student
        builder.HasOne(m => m.BlueCornerStudent)
            .WithMany(u => u.MatchesAsBlueCorner)
            .HasForeignKey(m => m.BlueCornerStudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Winner Student (optional)
        builder.HasOne(m => m.WinnerStudent)
            .WithMany(u => u.MatchesAsWinner)
            .HasForeignKey(m => m.WinnerStudentId)
            .OnDelete(DeleteBehavior.SetNull);

        // Tournament
        builder.HasOne(m => m.Tournament)
            .WithMany()
            .HasForeignKey(m => m.TournamentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Dojaang (optional)
        builder.HasOne(m => m.Dojaang)
            .WithMany()
            .HasForeignKey(m => m.DojaangId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
