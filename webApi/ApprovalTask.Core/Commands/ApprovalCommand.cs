using System.ComponentModel.DataAnnotations;

namespace ApprovalTask.Core.Commands
{
    public record ApprovalCommand(
        [Required(ErrorMessage = "โปรดเลือกรายการอย่างน้อย 1 รายการ")]
        List<int> Ids,

        [Required(ErrorMessage = "กรุณากรอกเหตุผลประกอบการดำเนินการ")]
        [MaxLength(1000)]
        string Reason,

        bool Approve
    );
}