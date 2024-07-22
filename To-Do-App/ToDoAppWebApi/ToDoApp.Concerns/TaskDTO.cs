namespace ToDoApp.Concerns
{
    public class TaskDTO
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int StatusId { get; set; }
        public string? Status { get; set; } = null!;
        public DateTime CreatedOn { get; set; }
        public DateTime? CompletedOn { get; set; }
    }

}
