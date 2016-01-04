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
    public class Modules
    {
        public static ClsJobNumber getJobNumber()
        {
            ClsJobNumber lst = new ClsJobNumber();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetJobNumber().FirstOrDefault();
            }
            return lst;
        }
        public static ClsReturnValues setRegister(ClsRegister obj)
        {
            ClsReturnValues lst = new ClsReturnValues();

            using (var db = new tdoEntities())
            {

                lst = db.uspAddEditRegister(obj.tdoRegisterID,obj.jobNumber,obj.dateReceived,obj.expiryDate,obj.status,obj.cargoTypeID,obj.fileRef,obj.destinationID,
                                            obj.terminalID,obj.containerNo,obj.returnTerminal,obj.truckID,obj.tdoReceiptDate,obj.schDelDate,obj.loadingTime,obj.dispatchTime,
                                            obj.remarks,obj.createdByID,obj.sessionID).FirstOrDefault();
            }
            return lst;
        }
        public static List<ClsRegister> getRegister(int registerID)
        {
            List<ClsRegister> lst = new List<ClsRegister>();
            using (var db = new tdoEntities())
            {
                lst = db.uspGetRegister(registerID).ToList<ClsRegister>();
            }
            return lst;
        }

        public static ClsReturnValues delRegister(int tdoRegisterID)
        {
            ClsReturnValues lst = new ClsReturnValues();
            using (var db = new tdoEntities())
            {
                lst = db.uspDelRegister(tdoRegisterID).FirstOrDefault();
            }
            return lst;
        }
    }
}