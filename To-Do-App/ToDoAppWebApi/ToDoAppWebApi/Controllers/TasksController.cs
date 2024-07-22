using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ToDoApp.Concerns;
using ToDoApp.Contracts;

namespace ToDoAppWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }


        [HttpPost("Add")]
        public async Task<IActionResult> AddTask([FromBody] TaskDTO task)
        {
            var userId = GetUserId();
            if (userId == null) { return BadRequest(); }
            await _taskService.AddTasksAync(task, userId.Value);
            return Created();
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateTask([FromBody] TaskDTO task)
        {
            var userId = GetUserId();
            if (userId == null) { return BadRequest(); }
            var isUpdated = await _taskService.UpdateTaskAync(task, userId.Value);
            if (!isUpdated)
            {
                return NotFound();
            }
            return Created();
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] DateTime? createdOn, [FromQuery] DateTime? completedOn, [FromQuery] int? statusId)
        {
            var userId = GetUserId();
            if (userId == null) { return BadRequest(); }
            var tasks = await _taskService.GetTasksAync(userId.Value, createdOn, completedOn, statusId);
            return Ok(tasks);
        }

        [HttpGet("{taskId}")]
        public async Task<IActionResult> GetTask([FromRoute] int taskId)
        {
            var userId = GetUserId();
            if (userId == null) { return BadRequest(); }
            var tasks = await _taskService.GetTaskAync(taskId, userId.Value);
            return Ok(tasks);
        }


        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask([FromRoute] int taskId)
        {
            var userId = GetUserId();
            if (userId == null) { return BadRequest(); }
            var isDeleted = await _taskService.DeleteTaskAync(taskId, userId.Value);
            if (!isDeleted) { return NotFound(); }
            return NoContent();
        }

        [HttpDelete("")]
        public async Task<IActionResult> DeleteAllTasks([FromQuery] DateTime? createdOn, [FromQuery] DateTime? completedOn)
        {
            var userId = GetUserId();
            if (userId == null) { return BadRequest(); }
            await _taskService.DeleteAllAync(userId.Value, createdOn, completedOn);
            return NoContent();
        }

        private int? GetUserId()
        {
            var userIdString = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
            int userId;
            if (userIdString == null || !int.TryParse(userIdString, out userId))
            {
                return null;
            }
            return userId;
        }
    }
}
