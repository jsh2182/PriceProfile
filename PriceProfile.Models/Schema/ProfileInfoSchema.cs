namespace PriceProfile.Models
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    public class ProfileInfoSchema
    {
       
        [DataMember]
        public int ID { get; set; }

        [DataMember]
        public string SoftwareName { get; set; }

        [DataMember]
        public string SoftwareDesc { get; set; }
        [DataMember]
        public double BasePrice { get; set; }
        //[DataMember]
        //public List<SoftwareFeatureSchema> SoftwareFeatures { get; set; }
    }
}
