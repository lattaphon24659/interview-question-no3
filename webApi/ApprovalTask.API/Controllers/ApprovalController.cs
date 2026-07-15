using ApprovalTask.Core.Commands;
using ApprovalTask.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApprovalTask.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApprovalController : ControllerBase
    {
        private readonly IApprovalRepository _repository;

        public ApprovalController(IApprovalRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var requests = await _repository.GetAllAsync();
            return Ok(requests);
        }

        [HttpPost("approve-or-reject")]
        public async Task<IActionResult> ApproveOrReject(
            [FromBody] ApprovalCommand request,
            [FromServices] ApprovalCommandHandler handler)
        {

            try
            {
                await handler.HandleAsync(request);
                return Ok(new { Message = "ดำเนินการสำเร็จเรียบร้อยแล้ว" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}