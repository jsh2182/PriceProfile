namespace PriceProfile.Models
{
    using System.Data.Entity;

    public partial class PriceProfileContext : DbContext
    {
        public PriceProfileContext()
            : base("name=PriceProfileConnection")
        {
            //Configuration.ProxyCreationEnabled = false;
        }
        
        public virtual DbSet<SoftwareFeature> FeatureLists { get; set; }
        public virtual DbSet<ProfileInfo> ProfileInfoes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProfileInfo>()
                .HasMany(e => e.FeatureLists)
                .WithRequired(e => e.ProfileInfo)
                .HasForeignKey(e => e.ProfileID)
                .WillCascadeOnDelete(true);
        }
    }
}
