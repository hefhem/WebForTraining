using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebForTraining.Database;
using WebForTraining.Models;

namespace WebForTraining.Controllers
{
    public class AdministrationController : Controller
    {
        // GET: Administration
        private string GetSession() { return Session["SessionID"].ToString(); }
        private int GetID() { return int.Parse(Session["UserID"].ToString()); }
        private string GetUserName() { return Session["Username"].ToString(); }


        private bool CheckSession()
        {
            if (Session["SessionID"] == null) { return false; }
            else
            {
                var ActiveSession = Login.getUserSessions()
                    .Where(p => p.isActive && p.sessionID == Guid.Parse(Session["SessionID"].ToString())).FirstOrDefault();
                if (ActiveSession == null) { return false; }
                else
                    return true;
            }
        }
private bool CheckResetSession()
        {
            if (Session["ResetID"] == null) { 
                return false;
            }
            else
            {
                return true;
            }
        }
        public ActionResult Index()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult Dashboard()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult Setup()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult Settings()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getUserGroupDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getUserDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult AddEditUserGroup()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult AddEditUser()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult changePassword()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult resetPassword()
        {
            if (!CheckResetSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getAccessLevel()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult AddEditMenus()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getMenusDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult AddEditMenuItems()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getMenuItemsDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult AddEditForms()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getFormsDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult AddEditMenuIcons()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getMenuIconsDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getCargoTypeDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditCargoType()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getTruckTypeDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditTruckType()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getDriverDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditDriver()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getRegionDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditRegion()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }


        public ActionResult getStateDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditState()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getCityDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditCity()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getLocationDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getCityDropDown()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditLocation()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getPortDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditPort()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getTerminalDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditTerminal()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult getTruckDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        public ActionResult AddEditTruck()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }



        public JsonResult setUsersGroup(string userGroupID, string groupName, string description)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(userGroupID) == 0 && !addableForms.Contains("UsersGroup"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(userGroupID) != 0 && !editableForms.Contains("UsersGroup"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (userGroupID == "") { userGroupID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0; 
            try { _id = int.Parse(userGroupID.Trim()); }
            catch { }
            ClsUserGroups obj = new ClsUserGroups()
            {
                userGroupID = _id,
                groupName = groupName,
                description = description,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setUsersGroup(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }
        [HttpPost]
        public JsonResult setUsers(string userID, string userGroupID, string userName, string Password, int isLocked, int resetPassword)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(userID) == 0 && !addableForms.Contains("Users"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(userID) != 0 && !editableForms.Contains("Users"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            Guid Session = new Guid(GetSession());
            if (Password == "") Password = " ";
            int _id = 0; try { _id = int.Parse(userID.Trim()); }
            catch { }
            int _grIid = 0; try { _grIid = int.Parse(userGroupID.Trim()); }
            catch { }
            bool Locked = false; bool reset = false;
            if (isLocked == 1) Locked = true; if (resetPassword == 1) reset = true;
            ClsUsers obj = new ClsUsers()
            {
                userID = _id,
                userGroupID = _grIid,
                userName = userName.Trim(),
                resetPassword = reset,
                password = Password,
                isLocked = Locked,
                createdByID = GetID(),
                theme = "Default",
                sessionID = Session
            };
            ClsReturnValues k = Administration.setUsers(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }
        public JsonResult deleteUsersGroup(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("UsersGroup"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delUsersGroup(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }
        public JsonResult deleteUser(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Users"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delUsers(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }
        public JsonResult setChangePassword(string userID, string oldPassword, string newPassword, string confirmNewPassword)
        {
            if (newPassword != confirmNewPassword)
            {
                return Json(new { id = 0, isSuccess = false, msg = "Confirm password not correct." });
            }
            int id = int.Parse(userID);
            
            ClsReturnValues k = Administration.changePassword(id, oldPassword, newPassword);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }
        public JsonResult setResetPassword(string userID, string newPassword, string confirmNewPassword)
        {
            if (newPassword != confirmNewPassword)
            {
                return Json(new { id = 0, isSuccess = false, msg = "Confirm password not correct." });
            }
            int id = int.Parse(userID);

            ClsReturnValues k = Administration.resetPassword(id, newPassword);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }
        public JsonResult setAccessLevel(string accessLevelID, string userGroupID, string formID, string canAdd, string canView, string canEdit, string canDelete, string canApprove)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (!addableForms.Contains("AccessLevels") && GetUserName() != "Admin")
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }

            Guid Session = new Guid(GetSession()); 
            List<ClsReturnValues> returnObjs = new List<ClsReturnValues>();

            var accessLevelID_ = StringToArray.PutInList(StringToArray.seperateCommaValues(accessLevelID, ','));
            var userGroupID_ = int.Parse(userGroupID);
            var formID_ = StringToArray.PutInList(StringToArray.seperateCommaValues(formID, ','));
            var canAdd_ = StringToArray.PutInList(StringToArray.seperateCommaValues(canAdd, ','));
            var canView_ = StringToArray.PutInList(StringToArray.seperateCommaValues(canView, ','));
            var canEdit_ = StringToArray.PutInList(StringToArray.seperateCommaValues(canEdit, ','));
            var canDelete_ = StringToArray.PutInList(StringToArray.seperateCommaValues(canDelete, ','));
            var canApprove_ = StringToArray.PutInList(StringToArray.seperateCommaValues(canApprove, ','));

            for (int i = 0; i < accessLevelID_.Count; i++)
            {
                if (formID_[i] == "") continue;
                ClsAccessLevels obj = new ClsAccessLevels()
                {
                    accessLevelID = int.Parse(accessLevelID_[i]),
                    formID = int.Parse(formID_[i]),
                    canAdd = bool.Parse(canAdd_[i]),
                    canView = bool.Parse(canView_[i]),
                    canEdit = bool.Parse(canEdit_[i]),
                    canDelete = bool.Parse(canDelete_[i]),
                    canApprove = bool.Parse(canApprove_[i]),
                    userGroupID = userGroupID_,
                    createdByID = GetID(),
                    sessionID = Session
                };

                returnObjs.Add(Administration.setAccessLevel(obj));
            }
            bool isSuccess = returnObjs.Count(p => p.IsSuccess == false) > 0 ? false : true;
            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = returnObjs.Count(p => p.IsSuccess == true).ToString() });
        }

        #region CargoType

        public JsonResult setCargoType(string cargoTypeID, string cargoTypeName)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(cargoTypeID) == 0 && !addableForms.Contains("CargoType"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(cargoTypeID) != 0 && !editableForms.Contains("CargoType"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (cargoTypeID == "") { cargoTypeID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(cargoTypeID.Trim()); }
            catch { }
            ClsCargoType obj = new ClsCargoType()
            {
                cargoTypeID = _id,
                cargoTypeName = cargoTypeName,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setCargoType(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteCargoType(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("CargoType"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delCargoType(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region TruckType

        public JsonResult setTruckType(string truckTypeID, string truckTypeName)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(truckTypeID) == 0 && !addableForms.Contains("TruckType"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(truckTypeID) != 0 && !editableForms.Contains("TruckType"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (truckTypeID == "") { truckTypeID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(truckTypeID.Trim()); }
            catch { }
            ClsTruckType obj = new ClsTruckType()
            {
                truckTypeID = _id,
                truckTypeName = truckTypeName,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setTruckType(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteTruckType(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("TruckType"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delTruckType(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region Driver

        public JsonResult setDriver(string driverID, string driverCode, string firstName, string middleName, string lastName)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(driverID) == 0 && !addableForms.Contains("Driver"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(driverID) != 0 && !editableForms.Contains("Driver"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (driverID == "") { driverID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(driverID.Trim()); }
            catch { }
            ClsDriver obj = new ClsDriver()
            {
                driverID = _id,
                driverCode = driverCode,
                firstName = firstName,
                middleName = middleName,
                lastName = lastName,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setDriver(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteDriver(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Driver"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delDriver(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region Region

        public JsonResult setRegion(string regionID, string regionName)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(regionID) == 0 && !addableForms.Contains("Region"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(regionID) != 0 && !editableForms.Contains("Region"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (regionID == "") { regionID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(regionID.Trim()); }
            catch { }
            ClsRegion obj = new ClsRegion()
            {
                regionID = _id,
                regionName = regionName,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setRegion(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteRegion(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Region"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delRegion(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region State

        public JsonResult setState(string stateID, string stateName, string stateCode)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(stateID) == 0 && !addableForms.Contains("State"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(stateID) != 0 && !editableForms.Contains("State"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (stateID == "") { stateID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(stateID.Trim()); }
            catch { }
            ClsState obj = new ClsState()
            {
                stateID = _id,
                stateName = stateName,
                stateCode = stateCode, 
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setState(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteState(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("State"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delState(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region City

        public JsonResult setCity(string cityID, string cityName, string cityCode, string stateID)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(cityID) == 0 && !addableForms.Contains("City"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(cityID) != 0 && !editableForms.Contains("City"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (cityID == "") { cityID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(cityID.Trim()); }
            catch { }
            ClsCity obj = new ClsCity()
            {
                cityID = _id,
                cityName = cityName,
                cityCode = cityCode,
                stateID = int.Parse(stateID),
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setCity(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteCity(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("City"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delCity(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region Location

        public JsonResult setLocation(string locationID, string locationName, string regionID)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(locationID) == 0 && !addableForms.Contains("Location"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(locationID) != 0 && !editableForms.Contains("Location"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (locationID == "") { locationID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(locationID.Trim()); }
            catch { }
            ClsLocation obj = new ClsLocation()
            {
                locationID = _id,
                locationName = locationName,
                regionID = int.Parse(regionID),
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setLocation(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteLocation(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Location"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delLocation(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region Port

        public JsonResult setPort(string portID, string portName, string locationID)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(portID) == 0 && !addableForms.Contains("Port"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(portID) != 0 && !editableForms.Contains("Port"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (portID == "") { portID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(portID.Trim()); }
            catch { }
            ClsPort obj = new ClsPort()
            {
                portID = _id,
                portName = portName,
                locationID = int.Parse(locationID),
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setPort(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deletePort(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Port"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delPort(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region Terminal

        public JsonResult setTerminal(string terminalID, string terminalName, string portID)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(terminalID) == 0 && !addableForms.Contains("Terminal"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(terminalID) != 0 && !editableForms.Contains("Terminal"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (terminalID == "") { terminalID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(terminalID.Trim()); }
            catch { }
            ClsTerminal obj = new ClsTerminal()
            {
                terminalID = _id,
                terminalName = terminalName,
                portID = int.Parse(portID),
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setTerminal(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteTerminal(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Terminal"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delTerminal(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        #region Truck

        public JsonResult setTruck(string truckID, string truckName, string regNumb, string truckTypeID)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(truckID) == 0 && !addableForms.Contains("Truck"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(truckID) != 0 && !editableForms.Contains("Truck"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (truckID == "") { truckID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(truckID.Trim()); }
            catch { }
            ClsTruck obj = new ClsTruck()
            {
                truckID = _id,
                truckName = truckName,
                regNumb = regNumb,
                truckTypeID = int.Parse(truckTypeID),
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setTruck(obj, Session);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteTruck(string ids)
        {

            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Truck"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delTruck(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        #endregion

        public JsonResult setMenus(string menuID, string menuName, string menuDesc, string menuRanking)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(menuID) == 0 && !addableForms.Contains("Menus"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(menuID) != 0 && !editableForms.Contains("Menus"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (menuID == "") { menuID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(menuID.Trim()); }
            catch { }
            ClsMenus obj = new ClsMenus()
            {
                menuID = _id,
                menuName = menuName,
                menuDesc = menuDesc,
                menuRanking = int.Parse(menuRanking),
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setMenus(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteMenus(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Menus"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }
            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delMenus(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }

        public JsonResult setMenuItems(string menuItemID, string menuID, string menuItemName, string menuItemDescription, string menuItemRanking)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(menuItemID) == 0 && !addableForms.Contains("MenuItems"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(menuItemID) != 0 && !editableForms.Contains("MenuItems"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (menuItemID == "") { menuItemID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(menuItemID.Trim()); }
            catch { }
            ClsMenuItems obj = new ClsMenuItems()
            {
                menuItemID = _id,
                menuID = int.Parse(menuID),
                menuItemName = menuItemName,
                menuItemDescription = menuItemDescription,
                menuItemRanking = int.Parse(menuItemRanking),
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setMenuItems(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteMenuItems(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("MenuItems"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }
            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delMenuItems(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }
        public JsonResult setMenuIcons(string menuIconID, string menuID, string menuIconName)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(menuIconID) == 0 && !addableForms.Contains("MenuIcons"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(menuIconID) != 0 && !editableForms.Contains("MenuIcons"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (menuIconID == "") { menuIconID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(menuIconID.Trim()); }
            catch { }
            ClsMenuIcons obj = new ClsMenuIcons()
            {
                menuIconID = _id,
                menuID = int.Parse(menuID),
                menuIconName = menuIconName
            };
            ClsReturnValues k = Administration.setMenuIcons(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteMenuIcons(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("MenuIcons"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delMenuIcons(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }
        public JsonResult setForms(string formID, string menuItemID, string formName, string formDescription)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(formID) == 0 && !addableForms.Contains("Forms"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(formID) != 0 && !editableForms.Contains("Forms"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (formID == "") { formID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(formID.Trim()); }
            catch { }
            ClsForms obj = new ClsForms()
            {
                formID = _id,
                menuItemID = int.Parse(menuItemID),
                formName = formName,
                formDescription = formDescription,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Administration.setForms(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteForms(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Forms"))
            {
                return Json(new{ id = 0, isSuccess = false, msg = "You are not allowed to delete records here" });
            }
             

            string[] id_s = ids.Trim().Split(',');
            string message = "";
            List<ClsReturnValues> obj = new List<ClsReturnValues>();
            foreach (var id in id_s)
            {
                int _id = 0; try { _id = int.Parse(id.Trim()); }
                catch { }
                if (_id > 0)
                    obj.Add(Administration.delForms(_id));
            }

            bool isSuccess = obj.Count(p => p.IsSuccess == false) > 0 ? false : true;
            if (obj.Count(p => p.IsSuccess == true) > 1)
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " records deleted";
            }
            else
            {
                message = obj.Count(p => p.IsSuccess == true).ToString() + " record deleted";
            }

            return Json(new { id = isSuccess ? 1 : 0, isSuccess = isSuccess ? 1 : 0, msg = message });
        }
    }
}

//List<ClsUserDisplay> userDisplay = returnedTuple.Item2;

//            List<string> editableForms = Restriction.GetEditableForms(userDisplay);

//            if (editableForms.Contains("Formula Detail"))
//            {
//                return EnPeopleBAL.Payroll.setFormulaDetail(FormulaDetail);
//            }
//            else return new ClsReturnValues() { ID = 0, IsSuccess = false, Response = "You are not allowed to create or edit records here" };