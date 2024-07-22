namespace EmployeeDirectory.Concerns
{
    //To Get Fiterd options in dropdown
    public class FilteringData
    {
        public HashSet<int>? StatusIds {  get; set; } 
        public HashSet<int>? LocationIds { get; set; }
        public HashSet<int>? DepartmentIds { get; set; }
    }
}
