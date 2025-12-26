namespace PriceProfile.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public partial class SoftwareFeatureSchema
    {
        [DataMember]
        public int ID { get; set; }
        
        [DataMember]
        public int ProfileID { get; set; }

        [DataMember]
        public string FeatureName { get; set; }

        [DataMember]
        public string FeatureDesc { get; set; }

        [DataMember]
        public bool IsCheckType { get; set; }

        [DataMember]
        public bool HasLimitation { get; set; }

        [DataMember]
        public bool CheckTypeDefaultValue { get; set; }

        [DataMember]
        public double MinimumLimitation { get; set; }

        [DataMember]
        public double Parameter_a { get; set; }

        [DataMember]
        public double Parameter_b { get; set; }
        [DataMember]
        public int FeatureValue { get; set; }
        [DataMember]
        public bool IsSelected { get; set; }
    }
}
