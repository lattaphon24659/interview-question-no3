using System.ComponentModel.DataAnnotations;

namespace ApprovalTask.Core.Commands
{
    public record ApprovalCommand(
        [property: Required(ErrorMessage = "โปรดเลือกรายการอย่างน้อย 1 รายการ")]
        List<int> Ids,

        [property: Required(ErrorMessage = "กรุณากรอกเหตุผลประกอบการดำเนินการ")]
        [property: MaxLength(1000)]
        string Reason,

        [property: Required]
        bool Approve
    );
}