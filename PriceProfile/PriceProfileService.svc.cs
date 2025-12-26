using PriceProfile.Models;
using PriceProfile.EFDataService;
using System;
using System.Collections.Generic;
using System.Linq;


namespace PriceProfile
{
    public class PriceProfileService : IPriceProfileService
    {
        private readonly PriceProfileContext profileContext = new PriceProfileContext();
        public bool AddFeature(SoftwareFeatureSchema model)
        {
            try
            {
                var efFeature = new SoftwareFeatureDataService(profileContext);
                //SoftwareFeature feature = null;
                efFeature.AddFeature(model);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public int AddProfile(ProfileInfoSchema profileInfo)
        {
            try
            {
                var efProfile = new ProfileInfoDataService(profileContext);
                var result = efProfile.AddProfile(profileInfo);
                return result;
            }
            catch (Exception ex)
            {

                return -1;
            }
        }

        public bool DeleteFeature(string featureID)
        {
            try
            {
                var featureDS = new SoftwareFeatureDataService(profileContext);
                return featureDS.DeleteFeature(int.Parse(featureID));
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public bool DeleteProfile(string id)
        {
            try
            {
                var profileDS = new ProfileInfoDataService(profileContext);
                return profileDS.DeleteProfile(int.Parse(id));
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public bool EditFeature(SoftwareFeatureSchema model)
        {
            try
            {
                var featureDS = new SoftwareFeatureDataService(profileContext);
                featureDS.EditFeature(model);
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public bool EditProfile(ProfileInfoSchema model)
        {
            try
            {
                var profileDS = new ProfileInfoDataService(profileContext);
                ProfileInfo profile = null;
                profileDS.Update(model, profile, model.ID); ;
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public SoftwareFeatureSchema GetFeature(int featureID)
        {
            try
            {
                var featureDS = new SoftwareFeatureDataService(profileContext);
                var f = featureDS.GetFeature(featureID);
                return f;
            }
            catch (Exception ex)
            {

                return null;
            }
        }

        public List<SoftwareFeatureSchema> GetFeatures(int profileID)
        {
            try
            {
                var featureDS = new SoftwareFeatureDataService(profileContext);
                return featureDS.GetFeatures(profileID).ToList();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public ProfileInfoSchema GetProfile(int id)
        {
            try
            {
                var profileDS = new ProfileInfoDataService(profileContext);
                var profile = profileDS.GetProfile(id);
                return profile;
            }
            catch (Exception ex)
            {

                return null;
            }
        }
        public ProfileInfoSchema SearchProfile(string searchParam, bool justContains)
        {
            try
            {
                var profileDS = new ProfileInfoDataService(profileContext);
                var profile = profileDS.SearchProfile(searchParam, justContains);
                return profile;
            }
            catch (Exception ex) 
            {

                return null;
            }
        }

        public List<ProfileInfoSchema> GetProfiles()
        {
            try
            {
                var profileDS = new ProfileInfoDataService(profileContext);
                var lstProfiles = profileDS.GetAllProfiles().ToList();
                return lstProfiles;
            }
            catch (Exception ex)
            {

                return null;
            }
        }
    }
}
