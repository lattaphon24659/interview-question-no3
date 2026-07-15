export enum ApprovalStatus {
    Pending = 0,    // รออนุมัติ
    Approved = 1,   // ออนุมัติ
    Rejected = 2    // ไม่อนุมัติ
}

export interface ApprovalRequest {
    id: number;
    title: string;
    reason?: string;
    status: ApprovalStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface ApprovalCommand {
    ids: number[];
    approve: boolean;
    reason: string;
}