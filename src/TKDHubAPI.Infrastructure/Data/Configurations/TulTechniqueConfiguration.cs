namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class TulTechniqueConfiguration : BaseEntityConfiguration<TulTechnique>
{
    public override void Configure(EntityTypeBuilder<TulTechnique> builder)
    {
        builder.HasKey(tt => new { tt.TulId, tt.TechniqueId });
        builder.HasOne(tt => tt.Tul)
            .WithMany(t => t.TulTechniques)
            .HasForeignKey(tt => tt.TulId);
        builder.HasOne(tt => tt.Technique)
            .WithMany(t => t.TulTechniques)
            .HasForeignKey(tt => tt.TechniqueId);
    }
}

