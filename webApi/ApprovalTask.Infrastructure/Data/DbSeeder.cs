using ApprovalTask.Core.Entities;
using ApprovalTask.Core.Enums;

namespace ApprovalTask.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static void SeedData(AppDbContext context)
        {
            // Seed only if there are no existing records
            if (!context.ApprovalRequests.Any())
            {
                var requests = new List<ApprovalRequest>();
                for (int i = 1; i <= 120; i++)
                {
                    var req = new ApprovalRequest
                    {
                        Title = $"Document Title {i:D4}",
                        CreatedAt = DateTime.UtcNow.AddHours(-i)
                    };

                    // Distribute statuses: Pending (1), Approved (0), Rejected (2)
                    if (i % 3 == 0)
                    {
                        req.ApproveOrReject("Auto-approved for mockup", true);
                    }
                    else if (i % 3 == 2)
                    {
                        req.ApproveOrReject("Auto-rejected for mockup", false);
                    }

                    requests.Add(req);
                }

                context.ApprovalRequests.AddRange(requests);
                context.SaveChanges();
            }
        }
    }
}
