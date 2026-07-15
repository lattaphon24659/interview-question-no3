using ApprovalTask.Core.Entities;

namespace ApprovalTask.Core.Interfaces
{
    public interface IApprovalRepository
    {
        Task<ApprovalRequest?> GetByIdAsync(int id);
        Task<IEnumerable<ApprovalRequest>> GetAllAsync();
        Task AddAsync(ApprovalRequest request);
        Task UpdateAsync(ApprovalRequest request);
    }
}