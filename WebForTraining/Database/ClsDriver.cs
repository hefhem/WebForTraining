//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebForTraining.Database
{
    using System;
    
    public partial class ClsDriver
    {
        public int driverID { get; set; }
        public string driverCode { get; set; }
        public string firstName { get; set; }
        public string middleName { get; set; }
        public string lastName { get; set; }
        public Nullable<System.DateTime> dateCreated { get; set; }
        public Nullable<System.DateTime> dateModified { get; set; }
        public Nullable<int> modifiedByID { get; set; }
        public Nullable<int> createdByID { get; set; }
        public Nullable<System.Guid> sessionID { get; set; }
        public string userName { get; set; }
    }
}