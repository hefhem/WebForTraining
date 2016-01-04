using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebForTraining.Database;

namespace WebForTraining.Models
{
    public class Setup
    {
        public static ClsReturnValues setCargoType(ClsCargoType item)
        {
            ClsReturnValues obj = new ClsReturnValues();
            try
            {
                using (var db = new tdoEntities())
                {
                    obj = db.uspAddEditCargoType(item.cargoTypeID, item.cargoTypeName,item.createdByID,item.sessionID).FirstOrDefault();
                }
            }
            catch (Exception ex) { obj.Response = ex.Message; obj.IsSuccess = false; obj.ID = 0; }
            return obj;
        }
    }
}