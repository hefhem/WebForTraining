using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebForTraining.Database;
using System.Threading;
using System.Security.Claims;
using System.Security.Permissions;

namespace WebForTraining.Models
{
    public class Administration
    {
        #region UsersGroup
        public static ClsReturnValues setUsersGroup(ClsUserGroups obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditUserGroups(obj.userGroupID, obj.groupName, obj.description ?? "", obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        //[PrincipalPermission(SecurityAction.Demand, Role = "Admin")]
        public static List<ClsUserGroups> getUsersGroup()
        {
            List<ClsUserGroups> lst = new List<ClsUserGroups>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetUserGroups().ToList<ClsUserGroups>();
            }
            return lst;
        }

        public static ClsReturnValues delUsersGroup(int usersGroupId)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelUsergroup(usersGroupId).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Users

        public static ClsReturnValues setUsers(ClsUsers obj)
        {
            //password encryption happens here
            obj.password = Security.Encrypt(obj.password);

            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditUsers(obj.userID, obj.userGroupID, obj.userName, obj.password, obj.password, obj.passwordCanExpire, obj.passwordExpiryDate, obj.isLocked, obj.loginAttempts, obj.lastLoginDate, obj.theme, obj.resetPassword, obj.createdByID, obj.sessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsUsers> getUsers()
        {
            List<ClsUsers> lst = new List<ClsUsers>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetUsers().ToList<ClsUsers>();
            }
            return lst;
        }

        public static ClsReturnValues delUsers(int userID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelUsers(userID).FirstOrDefault();
            }
            return lst;
        }

        #endregion users

        #region CargoType
        public static ClsReturnValues setCargoType(ClsCargoType obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditCargoType(obj.cargoTypeID, obj.cargoTypeName, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsCargoType> getCargoType()
        {
            List<ClsCargoType> lst = new List<ClsCargoType>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetCargoType(0).ToList<ClsCargoType>();
            }
            return lst;
        }

        public static ClsReturnValues delCargoType(int cargoTypeID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelCargoType(cargoTypeID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region TruckType
        public static ClsReturnValues setTruckType(ClsTruckType obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditTruckType(obj.truckTypeID, obj.truckTypeName, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsTruckType> getTruckType()
        {
            List<ClsTruckType> lst = new List<ClsTruckType>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetTruckType().ToList<ClsTruckType>();
            }
            return lst;
        }

        public static ClsReturnValues delTruckType(int truckTypeID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelTruckType(truckTypeID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Driver
        public static ClsReturnValues setDriver(ClsDriver obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditDriver(obj.driverID, obj.driverCode, obj.firstName, obj.middleName, obj.lastName, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsDriver> getDriver()
        {
            List<ClsDriver> lst = new List<ClsDriver>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetDriver().ToList<ClsDriver>();
            }
            return lst;
        }

        public static ClsReturnValues delDriver(int driverID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelDriver(driverID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Region
        public static ClsReturnValues setRegion(ClsRegion obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditRegion(obj.regionID, obj.regionName, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsRegion> getRegion()
        {
            List<ClsRegion> lst = new List<ClsRegion>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetRegion().ToList<ClsRegion>();
            }
            return lst;
        }

        public static ClsReturnValues delRegion(int regionID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelRegion(regionID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region State
        public static ClsReturnValues setState(ClsState obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditState(obj.stateID, obj.stateName, obj.stateCode, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsState> getState()
        {
            List<ClsState> lst = new List<ClsState>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetState().ToList<ClsState>();
            }
            return lst;
        }

        public static ClsReturnValues delState(int stateID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelState(stateID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region City
        public static ClsReturnValues setCity(ClsCity obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditCity(obj.cityID, obj.cityName, obj.cityCode, obj.stateID, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsCity> getCity()
        {
            List<ClsCity> lst = new List<ClsCity>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetCity(0).ToList<ClsCity>();
            }
            return lst;
        }

        public static ClsReturnValues delCity(int cityID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelCity(cityID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Location
        public static ClsReturnValues setLocation(ClsLocation obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditLocation(obj.locationID, obj.locationName, obj.regionID, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsLocation> getLocation()
        {
            List<ClsLocation> lst = new List<ClsLocation>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetLocation().ToList<ClsLocation>();
            }
            return lst;
        }

        public static ClsReturnValues delLocation(int locationID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelLocation(locationID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Port
        public static ClsReturnValues setPort(ClsPort obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditPort(obj.portID, obj.portName, obj.locationID, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsPort> getPort()
        {
            List<ClsPort> lst = new List<ClsPort>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetPort().ToList<ClsPort>();
            }
            return lst;
        }

        public static ClsReturnValues delPort(int portID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelPort(portID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Terminal
        public static ClsReturnValues setTerminal(ClsTerminal obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditTerminal(obj.terminalID, obj.terminalName, obj.portID, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsTerminal> getTerminal()
        {
            List<ClsTerminal> lst = new List<ClsTerminal>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetTerminal().ToList<ClsTerminal>();
            }
            return lst;
        }

        public static ClsReturnValues delTerminal(int terminalID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelTerminal(terminalID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Truck
        public static ClsReturnValues setTruck(ClsTruck obj, Guid SessionID)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditTruck(obj.truckID, obj.truckName, obj.regNumb, obj.truckTypeID, obj.createdByID, SessionID).FirstOrDefault();
            }
            return lst;
        }

        public static List<ClsTruck> getTruck()
        {
            List<ClsTruck> lst = new List<ClsTruck>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetTruck().ToList<ClsTruck>();
            }
            return lst;
        }

        public static ClsReturnValues delTruck(int truckID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelTruck(truckID).FirstOrDefault();
            }
            return lst;
        }

        #endregion

        #region Change Password
public static ClsReturnValues changePassword(int userID, string oldPassword, string newPassword)
        {
            newPassword = Security.Encrypt(newPassword);
            oldPassword = Security.Encrypt(oldPassword);
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspChangePassword(userID, oldPassword, newPassword).FirstOrDefault();
            }
            return lst;
        }
        public static ClsReturnValues resetPassword(int userID, string newPassword)
        {
            newPassword = Security.Encrypt(newPassword);
            ClsUsers U = Administration.getUsers().Where(p => p.userID == userID).ToList().FirstOrDefault();
            string oldPassword = U.password;
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspChangePassword(userID, oldPassword, newPassword).FirstOrDefault();
            }
            return lst;
        }
        #endregion

        #region Access Level
        public static ClsReturnValues setAccessLevel(ClsAccessLevels obj)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditAccessLevels(obj.accessLevelID,obj.userGroupID,obj.formID,obj.canAdd,obj.canView,obj.canEdit,obj.canDelete,obj.canApprove,obj.createdByID,obj.sessionID).FirstOrDefault();
            }
            return lst;
        }
        public static List<ClsAccessLevels> getAccessLevel(int accessLevelID, int userGroupID, int formID)
        {
            List<ClsAccessLevels> lst = new List<ClsAccessLevels>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetAccessLevels(accessLevelID, userGroupID, formID).ToList<ClsAccessLevels>();
            }
            return lst;
        }
        #endregion

        #region Menu, Menu Item, Forms, Icons
        public static ClsReturnValues setMenus(ClsMenus obj)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditMenus(obj.menuID,obj.menuName,obj.menuDesc, obj.createdByID,obj.menuRanking, obj.sessionID).FirstOrDefault();
            }
            return lst;
        }
        public static List<ClsMenus> getMenus(int menuID)
        {
            List<ClsMenus> lst = new List<ClsMenus>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetMenus(menuID).ToList<ClsMenus>();
            }
            return lst;
        }
        public static ClsReturnValues delMenus(int menuID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelMenus(menuID).FirstOrDefault();
            }
            return lst;
        }
        public static ClsReturnValues setMenuItems(ClsMenuItems obj)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditMenuItems(obj.menuItemID,obj.menuID,obj.menuItemName, obj.menuItemDescription, obj.menuItemRanking, obj.createdByID, obj.sessionID).FirstOrDefault();
            }
            return lst;
        }
        public static List<ClsMenuItems> getMenuItems(int menuItemID)
        {
            List<ClsMenuItems> lst = new List<ClsMenuItems>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetMenuItems(menuItemID).ToList<ClsMenuItems>();
            }
            return lst;
        }
        public static ClsReturnValues delMenuItems(int menuItemID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelMenuItems(menuItemID).FirstOrDefault();
            }
            return lst;
        }
        public static ClsReturnValues setMenuIcons(ClsMenuIcons obj)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditMenuIcons(obj.menuIconID, obj.menuID, obj.menuIconName).FirstOrDefault();
            }
            return lst;
        }
        public static List<ClsMenuIcons> getMenuIcons(int menuIconID)
        {
            List<ClsMenuIcons> lst = new List<ClsMenuIcons>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetMenuIcons(menuIconID).ToList<ClsMenuIcons>();
            }
            return lst;
        }
        public static ClsReturnValues delMenuIcons(int menuIconID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelMenuIcons(menuIconID).FirstOrDefault();
            }
            return lst;
        }
        public static ClsReturnValues setForms(ClsForms obj)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditForms(obj.formID,obj.menuItemID,obj.formName,obj.formDescription,obj.createdByID, obj.sessionID).FirstOrDefault();
            }
            return lst;
        }
        public static List<ClsForms> getForms(int formID)
        {
            List<ClsForms> lst = new List<ClsForms>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetForms(formID).ToList<ClsForms>();
            }
            return lst;
        }
        public static ClsReturnValues delForms(int formID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelForms(formID).FirstOrDefault();
            }
            return lst;
        }
        #endregion
    }
}