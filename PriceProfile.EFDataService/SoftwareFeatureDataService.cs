using PriceProfile.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;

namespace PriceProfile.EFDataService
{
    public class SoftwareFeatureDataService : EFBaseDataService<SoftwareFeature, SoftwareFeatureSchema, int>
    {
        public SoftwareFeatureDataService(PriceProfileContext context) : base(context)
        {

        }
        public override Expression<Func<SoftwareFeature, int>> GetKey()
        {
            return f => f.ID;
        }
        public IQueryable<SoftwareFeatureSchema> GetFeatures(int profileID)
        {
            var features = Current.Where(f => f.ProfileID == profileID).Select( f=> new SoftwareFeatureSchema()
            {
                 CheckTypeDefaultValue = f.CheckTypeDefaultValue,
                 FeatureDesc = f.FeatureDesc,
                 FeatureName = f.FeatureName,
                 HasLimitation = f.HasLimitation,
                 ID = f.ID,
                 IsCheckType = f.IsCheckType,
                 MinimumLimitation = f.MinimumLimitation,
                 Parameter_a = f.Parameter_a,
                 Parameter_b = f.Parameter_b,
                 ProfileID = f.ProfileID
            });
            return features;
        }
        public SoftwareFeatureSchema GetFeature(int id)
        {
            var f = Get(id);
            var schema =  new SoftwareFeatureSchema()
            {
                CheckTypeDefaultValue = f.CheckTypeDefaultValue,
                FeatureDesc = f.FeatureDesc,
                FeatureName = f.FeatureName,
                HasLimitation = f.HasLimitation,
                ID = f.ID,
                IsCheckType = f.IsCheckType,
                MinimumLimitation = f.MinimumLimitation,
                Parameter_a = f.Parameter_a,
                Parameter_b = f.Parameter_b,
                ProfileID = f.ProfileID
            };
            return schema;
        }
        public bool DeleteFeature(int featureID)
        {
            var feature = Get(featureID);
            if (feature == null || feature.ID == 0)
                return false;
            Delete(feature);
            return true;
        }
        public SoftwareFeature AddFeature(SoftwareFeatureSchema model)
        {
            SoftwareFeature feature = null;
           return Add(model, feature, model.ID);
        }
        public SoftwareFeature EditFeature(SoftwareFeatureSchema model)
        {
            SoftwareFeature feature = null;
            return Update(model, feature, model.ID);
        }
    }
}
