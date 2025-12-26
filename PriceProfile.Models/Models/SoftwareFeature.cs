namespace PriceProfile.Models
{
    using Newtonsoft.Json;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Runtime.Serialization;

    [Table("SoftwareFeature")]
    public partial class SoftwareFeature
    {
        [Key]
        public int ID { get; set; }
        
        public int ProfileID { get; set; }

        [Required]
        [StringLength(150)]
        public string FeatureName { get; set; }

        [StringLength(500)]
        public string FeatureDesc { get; set; }

        public bool IsCheckType { get; set; }

        public bool HasLimitation { get; set; }

        public bool CheckTypeDefaultValue { get; set; }

        public double MinimumLimitation { get; set; }

        public double Parameter_a { get; set; }

        public double Parameter_b { get; set; }
        public virtual ProfileInfo ProfileInfo { get; set; }
    }
}
