using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebForTraining.Database;
using WebForTraining.Models;

namespace WebForTraining.Controllers
{
    public class ModulesController : Controller
    {
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
        // GET: Modules
        public ActionResult Index()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult Register()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult Dispatch()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult uploadRegister() {
            if (!CheckSession()) {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getRegisterDisplay()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult getRegisterDisplayForDispatch()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        
        public JsonResult setRegister(string tdoRegisterID, string jobNumber,string dateReceived,string expiryDate,string status,string cargoTypeID,string fileRef,
                                        string destinationID,string terminalID,string containerNo, string returnTerminal,string truckID,string tdoReceiptDate,string schDelDate,
                                          string remarks,string createdByID,string sessionID)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(tdoRegisterID) == 0 && !addableForms.Contains("Register"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(tdoRegisterID) != 0 && !editableForms.Contains("Register"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (tdoRegisterID == "") { tdoRegisterID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(tdoRegisterID.Trim()); }
            catch { }
            ClsRegister obj = new ClsRegister()
            {
                tdoRegisterID = _id,
                jobNumber = jobNumber,
                dateReceived = StringToArray.ConvertToDate(dateReceived),
                expiryDate = StringToArray.ConvertToDate(expiryDate),
                status = status,
                cargoTypeID = int.Parse(cargoTypeID),
                fileRef = fileRef,
                destinationID = int.Parse(destinationID),
                terminalID = int.Parse(terminalID),
                containerNo = containerNo,
                returnTerminal = int.Parse(returnTerminal),
                truckID = int.Parse(truckID),
                tdoReceiptDate = StringToArray.ConvertToDate(tdoReceiptDate),
                schDelDate = StringToArray.ConvertToDate(schDelDate),
                remarks = remarks,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Modules.setRegister(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }
        public JsonResult setDispatch(string tdoRegisterID,string status,string loadingDate,string loadingTime,string dispatchDate, string dispatchTime,string remarks, string createdByID, string sessionID)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> editableForms = Restriction.GetEditableForms(userDisplay);
            List<string> addableForms = Restriction.GetAddableForms(userDisplay);

            if (int.Parse(tdoRegisterID) == 0 && !addableForms.Contains("Dispatch"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to add new records." });
            }
            else if (int.Parse(tdoRegisterID) != 0 && !editableForms.Contains("Dispatch"))
            {
                return Json(new { id = 0, isSuccess = false, msg = "You are not allowed to edit records." });
            }

            if (tdoRegisterID == "") { tdoRegisterID = "0"; }

            Guid Session = new Guid(GetSession()); //do not hard code session ID and createdbyID
            int _id = 0;
            try { _id = int.Parse(tdoRegisterID.Trim()); }
            catch { }
            ClsRegister rg = Modules.getRegister(_id).FirstOrDefault();
            //var ldTime = StringToArray.ConvertToDate(loadingDate);
            //var dpTime = StringToArray.ConvertToDate(dispatchDate);
            if (dispatchDate == "") { dispatchDate = "1900-01-01"; }
            if (dispatchTime == "") { dispatchTime = "00:00"; }
            if (loadingDate == "") { loadingDate = "1900-01-01";}
            if (loadingTime == "") { loadingTime = "00:00"; }
            //var ldTime = Convert.ToDateTime(loadingDate+" "+loadingTime);
            //var dpTime = Convert.ToDateTime(dispatchDate+" "+dispatchTime);
            //DateTime dt1 = DateTime.ParseExact(one + " " + two, "dd/MM/yy h:mm:ss tt", CultureInfo.InvariantCulture);
            var ldTime = DateTime.Parse(loadingDate + " " + loadingTime);
            var dpTime = DateTime.Parse(dispatchDate + " " + dispatchTime);
            ClsRegister obj = new ClsRegister()
            {
                tdoRegisterID = _id,
                jobNumber = rg.jobNumber,
                dateReceived = rg.dateReceived,
                expiryDate = rg.expiryDate,
                status = status,
                cargoTypeID = rg.cargoTypeID,
                fileRef = rg.fileRef,
                destinationID = rg.destinationID,
                terminalID = rg.terminalID,
                containerNo = rg.containerNo,
                returnTerminal = rg.returnTerminal,
                truckID = rg.truckID,
                tdoReceiptDate = rg.tdoReceiptDate,
                schDelDate = rg.schDelDate,
                loadingTime = ldTime,
                dispatchTime = dpTime,
                remarks = remarks,
                createdByID = GetID(),
                sessionID = Session
            };
            ClsReturnValues k = Modules.setRegister(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }

        public JsonResult deleteRegister(string ids)
        {
            List<ClsUserDisplay> userDisplay = new List<ClsUserDisplay>();
            using (tdoEntities db = new tdoEntities())
            {
                userDisplay = db.uspGetUserDisplay(GetID()).ToList<ClsUserDisplay>();
            }
            List<string> deleteableForms = Restriction.GetDeletableForms(userDisplay);

            if (!deleteableForms.Contains("Register"))
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
                    obj.Add(Modules.delRegister(_id));
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
        public ViewResult uploadRegisterData() {
            
            Guid cSession = new Guid(GetSession());
            var r = new List<UploadFilesResult>();
            if (Session["sesTmpFile"] != null) Utility.deleteFile(Session["sesTmpFile"].ToString());
            string savedFileName = "", extension = ""; Random rnd = new Random();

            foreach (string file in Request.Files) {
                
                HttpPostedFileBase hpf = Request.Files[file] as HttpPostedFileBase;
                if (hpf.ContentLength == 0) continue;
                extension = Path.GetExtension(hpf.FileName);
                savedFileName = Server.MapPath("~/tempUpload/tmp_" + rnd.Next(1, 999999).ToString() + extension);
                Session["sesTmpFile"] = savedFileName;
                hpf.SaveAs(savedFileName);
                //r.Add(new UploadFilesResult() {
                //    FilePreviousName = hpf.FileName,
                //    Length = hpf.ContentLength,
                //    Type = hpf.ContentType,
                //    FileNewName = Path.GetFileName(savedFileName)
                //});
            }
            List<ClsUploadRegister> lst = ExcelReader.getRegisterFromExcel(savedFileName, GetID(), cSession).ToList();
            return View(lst);
        }
    }

    public class UploadFilesResult {
        public string FilePreviousName { get; set; }
        public string FileNewName { get; set; }
        public int Length { get; set; }
        public string Type { get; set; }


    }
    public class Utility {
        public static void deleteFile(string dirFileName) {
            try { if (File.Exists(dirFileName)) File.Delete(dirFileName); } catch { }
        }
    }
}