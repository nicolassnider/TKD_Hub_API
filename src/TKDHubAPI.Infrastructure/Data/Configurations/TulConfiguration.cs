namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class TulConfiguration : BaseEntityConfiguration<Tul>
{
    public override void Configure(EntityTypeBuilder<Tul> builder)
    {
        base.Configure(builder); // Call the base class's Configure method

        // Properties Configuration
        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(t => t.RecommendedRankId)
            .IsRequired();

        builder.Property(t => t.VideoUrl)
            .HasMaxLength(2048); // Standard max length for URLs

        builder.Property(t => t.ImageUrl)
            .HasMaxLength(2048);

        // Relationships Configuration
        //  Foreign Key relationship with Rank
        builder.HasOne(t => t.RecommendedRank)
               .WithMany(r => r.Tuls)
               .HasForeignKey(t => t.RecommendedRankId)
               .OnDelete(DeleteBehavior.NoAction);
    }
}

