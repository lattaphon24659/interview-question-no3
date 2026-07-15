using ApprovalTask.Core.Enums;

namespace ApprovalTask.Core.Entities
{
    public class ApprovalRequest
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Reason { get; set; }
        public ApprovalStatus Status { get; private set; } = ApprovalStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // พฤติกรรมการเปลี่ยนสถานะเป็น ออนุมัติ หรือ ไม่อนุมัติ
        public void ApproveOrReject(string reason, bool approve)
        {
            if (Status != ApprovalStatus.Pending)
            {
                throw new InvalidOperationException("สัญญานี้ไม่ได้อยู่ในสถานะรออนุมัติ");
            }
            Status = approve ? ApprovalStatus.Approved : ApprovalStatus.Rejected;
            Reason = reason;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}