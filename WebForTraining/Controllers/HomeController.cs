using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebForTraining.Models;
using WebForTraining.Database;

namespace WebForTraining.Controllers
{
    public class HomeController : Controller
    {
        private string GetSession() { return Session["SessionID"].ToString(); }
        private int GetID() { return int.Parse(Session["UserID"].ToString()); }
        private int GetCompanyID() { return int.Parse(Session["CompanyID"].ToString()); }


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
        public ActionResult Index()
        {
            if (!CheckSession()) {
                return RedirectToAction("Index", "Login"); 
            }
            return View();
        }

        public ActionResult CargoType()
        {
            if (!CheckSession())
            {
                return RedirectToAction("Index", "Login");
            }
            ViewBag.Message = "Cargo Type";

            return View();
        }


        [HttpPost]
        public JsonResult setCargoType(int cargoTypeID, string cargoTypeName, int createdByID)
        {
            createdByID = 1;
            ClsCargoType obj = new ClsCargoType()
            {
                cargoTypeID = cargoTypeID,
                cargoTypeName = cargoTypeName,
                createdByID = createdByID
            };
            ClsReturnValues k = Setup.setCargoType(obj);
            return Json(new { id = k.ID, isSuccess = k.IsSuccess ?? false ? 1 : 0, msg = k.Response });
        }
    }
}