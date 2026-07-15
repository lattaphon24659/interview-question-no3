using ApprovalTask.Core.Interfaces;

namespace ApprovalTask.Core.Commands
{
    public class ApprovalCommandHandler
    {
        private readonly IApprovalRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public ApprovalCommandHandler(IApprovalRepository repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task HandleAsync(ApprovalCommand command)
        {
            if (command.Ids == null || command.Ids.Count == 0)
            {
                throw new ArgumentException("โปรดเลือกรายการที่ต้องการดำเนินการ");
            }

            foreach (var id in command.Ids)
            {
                var appRequest = await _repository.GetByIdAsync(id);
                if (appRequest == null) continue;

                appRequest.ApproveOrReject(command.Reason, command.Approve);
                await _repository.UpdateAsync(appRequest);
            }

            await _unitOfWork.SaveChangesAsync();
        }
    }
}