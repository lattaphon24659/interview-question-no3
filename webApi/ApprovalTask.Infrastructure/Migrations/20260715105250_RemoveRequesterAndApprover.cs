using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApprovalTask.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRequesterAndApprover : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Approver",
                table: "ApprovalRequests");

            migrationBuilder.DropColumn(
                name: "Requester",
                table: "ApprovalRequests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Approver",
                table: "ApprovalRequests",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Requester",
                table: "ApprovalRequests",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
