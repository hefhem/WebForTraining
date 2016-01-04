using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebForTraining.Controllers
{
    public class AuctionController : Controller
    {
        // GET: Auction
        public ActionResult Index()
        {
            return View();
        }

        // GET: Auction/Details/5
        [Authorize]
        public ActionResult Details(long id = 0)
        {
            var auction = new WebForTraining.Models.Auction
            {
                Id = id,
                Title = "Brand new Widget 2.0",
                Description = "This a brand new version 2.0 Widget!",
                StartPrice = 1.00m,
                CurrentPrice = 13.40m,
                StartTime = DateTime.Parse("15-06-2012 12:34:00"),
                EndTime = DateTime.Parse("23-06-2012 12:34:00")
            };
            return View(auction);
        }

        // GET: Auction/Create
        [HttpGet]
        public ActionResult Create()
        {
            return View();
        }

        // POST: Auction/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Auction/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Auction/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Auction/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Auction/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
