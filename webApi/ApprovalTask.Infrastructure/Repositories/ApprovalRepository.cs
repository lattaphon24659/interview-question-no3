using ApprovalTask.Core.Entities;
using ApprovalTask.Core.Interfaces;
using ApprovalTask.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApprovalTask.Infrastructure.Repositories
{
    public class ApprovalRepository : IApprovalRepository
    {
        private readonly AppDbContext _context;

        public ApprovalRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ApprovalRequest?> GetByIdAsync(int id)
        {
            return await _context.ApprovalRequests.FindAsync(id);
        }

        public async Task<IEnumerable<ApprovalRequest>> GetAllAsync()
        {
            return await _context.ApprovalRequests.ToListAsync();
        }

        public async Task AddAsync(ApprovalRequest request)
        {
            await _context.ApprovalRequests.AddAsync(request);
        }

        public async Task UpdateAsync(ApprovalRequest request)
        {
            _context.ApprovalRequests.Update(request);
            await Task.CompletedTask;
        }
    }
}