using PriceProfile.Models;
using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

namespace PriceProfile.EFDataService
{
    public class ProfileInfoDataService : EFBaseDataService<ProfileInfo, ProfileInfoSchema, int>
    {
        public ProfileInfoDataService(PriceProfileContext context) : base(context)
        {

        }
        public override Expression<Func<ProfileInfo, int>> GetKey()
        {
            return p => p.ID;
        }
        public bool DeleteProfile(int id)
        {
            var profile = Get(id);
            if (profile == null || profile.ID == 0)
                return false;
            Delete(profile);
            return true;
        }
        public ProfileInfoSchema GetProfile(int id)
        {
            var profile = All().Include(p => p.FeatureLists).First();
            var profileSchema = new ProfileInfoSchema()
            {
                BasePrice = profile.BasePrice,
                ID = profile.ID,
                SoftwareDesc = profile.SoftwareDesc,
                SoftwareName = profile.SoftwareName
            };
            return profileSchema;

        }
        public ProfileInfoSchema SearchProfile(string searchParam, bool justContains)
        {
            ProfileInfo profile;
            if (justContains)
                profile = All().First(p => p.SoftwareDesc.Contains(searchParam) || p.SoftwareName.Contains(searchParam));
            else
                profile = All().First(p => p.SoftwareDesc.Equals(searchParam) || p.SoftwareName.Equals(searchParam));
            var profileSchema = new ProfileInfoSchema()
            {
                BasePrice = profile.BasePrice,
                ID = profile.ID,
                SoftwareDesc = profile.SoftwareDesc,
                SoftwareName = profile.SoftwareName
            };
            return profileSchema;

        }
        public IQueryable<ProfileInfoSchema> GetAllProfiles()
        {
            var profileSchema = All().Select(p => new ProfileInfoSchema()
            {
                BasePrice = p.BasePrice,
                ID = p.ID,
                SoftwareDesc = p.SoftwareDesc,
                SoftwareName = p.SoftwareName
            });
            return profileSchema;

        }
        public int AddProfile(ProfileInfoSchema model)
        {
            ProfileInfo profile = null;
            profile = Add(model, profile, model.ID);
            return profile.ID;
        }
        public void EditProfile(ProfileInfoSchema model)
        {
            ProfileInfo profile = null;
            Update(model, profile, model.ID);
        }
    }
}
