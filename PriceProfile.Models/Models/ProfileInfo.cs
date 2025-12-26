namespace PriceProfile.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("ProfileInfo")]
    public partial class ProfileInfo
    {
        public ProfileInfo()
        {
            FeatureLists = new List<SoftwareFeature>();
        }
       
        [Key]
        public int ID { get; set; }

        [Required]
        [StringLength(150)]
        public string SoftwareName { get; set; }

        [StringLength(500)]
        public string SoftwareDesc { get; set; }

        public double BasePrice { get; set; }

        public virtual ICollection<SoftwareFeature> FeatureLists { get; set; }
    }
}
