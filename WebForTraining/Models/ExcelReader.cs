using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.OleDb;
using System.IO;
using Excel;
using System.Globalization;
using System.Web;
using WebForTraining.Database;
using System.Threading;
using System.Security.Claims;
using System.Security.Permissions;

namespace WebForTraining.Models
{

    public class ExcelReader
    {
        private static int[] _getDateFormatY_M_D()
        {
            CultureInfo ci = CultureInfo.CurrentCulture; DateTimeFormatInfo dtfi = ci.DateTimeFormat;
            string datePattern = dtfi.ShortDatePattern.Trim().Replace("  ", "-").Replace(' ', '-')
                .Replace('/', '-').Replace('\\', '-').Replace(',', '-').Replace(';', '-').Replace('_', '-').Replace('.', '-');
            int yr = 0, day = 0, mth = 0;
            string[] pattern = dtfi.ShortDatePattern.ToLower().Trim().Split('-');
            if (pattern[0].Contains('y')) yr = 0; else if (pattern[1].Contains('y')) yr = 1; else yr = 2;
            if (pattern[0].Contains('m')) mth = 0; else if (pattern[1].Contains('m')) mth = 1; else mth = 2;
            if (pattern[0].Contains('d')) day = 0; else if (pattern[1].Contains('d')) day = 1; else day = 2;
            int[] yrMthDay = { yr, mth, day };
            return yrMthDay;
        }

        public static DateTime convertToDate(string strDate)
        {
            strDate = strDate.ToLower().Trim();
            string[] months = { "", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december" };
            string[] mths = { "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" };
            for (int m = 1; m <= 12; m++)
            {
                strDate = strDate.Replace(months[m], m.ToString()); strDate = strDate.Replace(mths[m], m.ToString());
            }
            try
            {
                if (strDate.Contains(" ") || strDate.Contains(":") || strDate.ToLower().Contains("am") || strDate.ToLower().Contains("pm"))
                    strDate = strDate.Split(' ')[0].Trim();
            }
            catch { }

            strDate = strDate.Trim(); strDate = strDate.Replace("  ", "-").Replace(' ', '-')
      .Replace('/', '-').Replace('\\', '-').Replace(',', '-').Replace(';', '-').Replace('_', '-').Replace('.', '-');
            string[] yrMthDay = strDate.Split('-');
            DateTime _date = DateTime.Now; int yr = 0, mth = 0, day = 0;
            //int[] dtIndex = _getDateFormatY_M_D();  //year,month,day
            if (strDate.Contains('-'))
            {
                try
                {
                    //yr = int.Parse(yrMthDay[dtIndex[0]]);  mth = int.Parse(yrMthDay[dtIndex[1]]);   day = int.Parse(yrMthDay[dtIndex[2]]);
                    string _yr = yrMthDay[0].Trim(), _mth = yrMthDay[1].Trim(), _day = yrMthDay[2].Trim();
                    if (_yr.Length == 4) //yyyy-mm-dd
                    {
                        yr = int.Parse(yrMthDay[0].Trim()); mth = int.Parse(yrMthDay[1].Trim()); day = int.Parse(yrMthDay[2].Trim());
                        if (mth > 12) { int _m = mth; mth = day; day = _m; }
                    }
                    else //dd-mm-yyyy
                    {
                        yr = int.Parse(yrMthDay[2].Trim()); mth = int.Parse(yrMthDay[1].Trim()); day = int.Parse(yrMthDay[0].Trim());
                        if (mth > 12) { int _m = mth; mth = day; day = _m; }
                    }
                    _date = new DateTime(yr, mth, day);
                }
                catch { throw; }
            }
            else
            {
                DateTime dt = DateTime.Now;
                try { dt = DateTime.Parse(strDate); }
                catch { } _date = new DateTime(dt.Year, dt.Month, dt.Day);
            }
            return _date;
        }

        public static string GetConnectionString(string filename)
        {
            string strCon;

            if (filename == null)
            {
                return "Choose an excel file to upload";
            }
            else
            {
                if (filename.Substring(filename.LastIndexOf(".")).ToLower() == ".xlsx")
                {
                    return strCon = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filename + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                }
                else if (filename.Substring(filename.LastIndexOf(".")).ToLower() == ".xls")
                {
                    return strCon = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + filename + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                }
                else if (filename.Substring(filename.LastIndexOf(".")).ToLower() == ".csv")
                {

                    //Provider=Microsoft.Jet.OLEDB.4.0;Data Source=c:\txtFilesFolder\;Extended Properties="text;HDR=Yes;FMT=Fixed";
                    return strCon = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + filename + ";" + "Extended Properties='text;HDR=YES;FMT=Fixed'";
                }
                else
                {
                    return "";
                }
            }
        }

        public static DataTable GetCsvData(string fileName)
        {
            try
            {

                string strCon = GetConnectionString(fileName);
                //string strFileName = "D://FXDEAL.csv";
                OleDbConnection conn = new OleDbConnection(strCon);
                conn.Open();
                OleDbDataAdapter adapter = new OleDbDataAdapter("SELECT * FROM " + System.IO.Path.GetFileName(fileName), conn);
                DataSet ds = new DataSet("Temp");
                adapter.Fill(ds);
                DataTable tb = ds.Tables[0];
                return tb;
            }
            catch (Exception)
            {

                return new DataTable();
            }
        }

        public static DataTable GetExcelData(string fileName)
        {
            try
            {
                FileStream stream = File.Open(fileName, FileMode.Open, FileAccess.Read);
                string extension = Path.GetExtension(fileName.Trim().ToLower());
                IExcelDataReader excelReader;
                if (extension.Contains("xlsx")) excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                else if (extension.Contains("xls")) excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
                else return new DataTable();
                excelReader.IsFirstRowAsColumnNames = true;
                DataSet resultDB = excelReader.AsDataSet();
                //while (excelReader.Read()) { excelReader.GetInt32(0); }
                excelReader.Close();
                return resultDB.Tables[0];
            }
            catch { return new DataTable(); }
        }
        public static List<string> getPinsFromExcel(string fileName)
        {
            List<string> lstPINs = new List<string>();
            try
            {
                DataTable resultTable = GetExcelData(fileName);   //DataTable resultTable = GetCsvData(fileName);
                foreach (DataRow dr in resultTable.Rows)
                {
                    string colValu = "";
                    try { colValu = dr[0].ToString().Trim(); }
                    catch { }
                    if (colValu.Length > 5) lstPINs.Add(colValu);
                }
            }
            catch { }
            return lstPINs;
        }

        public static List<ClsUploadRegister> getRegisterFromExcel(string fileName, int userID, Guid session)
        {
            List<ClsUploadRegister> lstRegister = new List<ClsUploadRegister>();
            List<ClsUploadRegister> lstResponse = new List<ClsUploadRegister>();
            List<ClsUploadRegister> lst = new List<ClsUploadRegister>();
            try
            {
                DataTable resultTable = GetExcelData(fileName);   //DataTable resultTable = GetCsvData(fileName);
                foreach (DataRow dr in resultTable.Rows)
                {
                    try
                    {
                        double dateR = double.Parse(dr[1].ToString().Trim());
                        var _dateR = DateTime.Parse(DateTime.FromOADate(dateR).ToString("yyyy-MM-dd hh:ss"));
                        double expDate = double.Parse(dr[2].ToString().Trim());
                        var _expDate = DateTime.Parse(DateTime.FromOADate(expDate).ToString("yyyy-MM-dd hh:ss"));
                        double tRDate = double.Parse(dr[11].ToString().Trim());
                        var _tRDate = DateTime.Parse(DateTime.FromOADate(tRDate).ToString("yyyy-MM-dd hh:ss"));
                        double sdDate = double.Parse(dr[12].ToString().Trim());
                        var _sdDate = DateTime.Parse(DateTime.FromOADate(sdDate).ToString("yyyy-MM-dd hh:ss"));
                        double dpTime = double.Parse(dr[13].ToString().Trim());
                        var _dpTime = DateTime.Parse(DateTime.FromOADate(dpTime).ToString("yyyy-MM-dd hh:ss"));
                        double ldTime = double.Parse(dr[14].ToString().Trim());
                        var _ldTime = DateTime.Parse(DateTime.FromOADate(ldTime).ToString("yyyy-MM-dd hh:ss"));

                        

                        lstRegister.Add(new ClsUploadRegister()
                        {
                            jobNumber = dr[0].ToString().Trim(),
                            dateReceived = _dateR,
                            expiryDate = _expDate,
                            status = dr[3].ToString().Trim(),
                            cargoType = dr[4].ToString().Trim(),
                            fileRef = dr[5].ToString().Trim(),
                            terminal = dr[6].ToString().Trim(),
                            destination = dr[7].ToString().Trim(),
                            containerNo = dr[8].ToString().Trim(),
                            returnTerminal = dr[9].ToString().Trim(),
                            truck = dr[10].ToString().Trim(),
                            tdoReceiptDate = _tRDate,
                            schDelDate = _sdDate,
                            dispatchTime = _dpTime,
                            loadingTime = _ldTime,
                            remarks = dr[15].ToString().Trim(),
                            response = ""
                        });
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }

                foreach (var item in lstRegister)
                {
                    try
                    {
                        using (var db = new tdoEntities())
                        {
                            lst = db.uspUploadRegister(item.jobNumber, item.dateReceived, item.expiryDate, item.status, item.cargoType, item.fileRef,
                                            item.destination, item.terminal,item.containerNo, item.returnTerminal, item.truck, item.tdoReceiptDate,
                                            item.schDelDate, item.loadingTime, item.dispatchTime, item.remarks, userID, session).ToList<ClsUploadRegister>();
                        }
                        foreach (var dt in lst)
                        {
                            lstResponse.Add(new ClsUploadRegister()
                            {
                                jobNumber = dt.jobNumber,
                                dateReceived = dt.dateReceived,
                                expiryDate = dt.expiryDate,
                                status = dt.status,
                                cargoType = dt.cargoType,
                                fileRef = dt.fileRef,
                                destination = dt.destination,
                                terminal = dt.terminal,
                                containerNo = dt.containerNo,
                                returnTerminal = dt.returnTerminal,
                                truck = dt.truck,
                                tdoReceiptDate = dt.tdoReceiptDate,
                                schDelDate = dt.schDelDate,
                                loadingTime = dt.loadingTime,
                                dispatchTime = dt.dispatchTime,
                                remarks = dt.remarks,
                                isSuccess = dt.isSuccess,
                                response = dt.response
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstResponse;
        }
    }
}
