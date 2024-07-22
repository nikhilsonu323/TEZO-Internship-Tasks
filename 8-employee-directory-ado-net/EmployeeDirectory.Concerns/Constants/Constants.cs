namespace EmployeeDirectory.Concerns.Constants
{
    public static class Constants
    {
        public readonly static string InvalidChoice = "Enter valid choice : ";

        public readonly static string EnterChoice = "Enter your choice : ";
        public static List<string> Departments { get; } = ["UIUX", "IT", "Product Engg."];
        public static List<string> Projects { get; } = ["Task1", "Task2", "Task3"];
    }
}
