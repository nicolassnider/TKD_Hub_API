namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class PromotionConfiguration : BaseEntityConfiguration<Promotion>
{
    public override void Configure(EntityTypeBuilder<Promotion> builder)
    {
        base.Configure(builder);

        // Student relationship
        builder.HasOne(p => p.Student)
            .WithMany(u => u.PromotionsAsStudent)
            .HasForeignKey(p => p.StudentId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Promotions_Users_StudentId");

        // Coach relationship
        builder.HasOne(p => p.Coach)
            .WithMany(u => u.PromotionsAsCoach)
            .HasForeignKey(p => p.CoachId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Promotions_Users_CoachId");

        // Rank relationship (optional, but explicit is good practice)
        builder.HasOne(p => p.Rank)
            .WithMany()
            .HasForeignKey(p => p.RankId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Promotions_Ranks_RankId");

        // Dojaang relationship (optional, but explicit is good practice)
        builder.HasOne(p => p.Dojaang)
            .WithMany()
            .HasForeignKey(p => p.DojaangId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Promotions_Dojaangs_DojaangId");
    }
}

