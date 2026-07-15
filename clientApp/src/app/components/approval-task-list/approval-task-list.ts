import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApprovalService } from '../../services/approval.service';
import { ApprovalRequest } from '../../models/approval-request.model';
import { ApprovalStatus } from '../../models/approval-request.model';

@Component({
  selector: 'app-approval-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-task-list.html',
  styleUrl: './approval-task-list.css',
})
export class ApprovalTaskList implements OnInit {
  private readonly approvalService = inject(ApprovalService);

  // ข้อมูลดั้งเดิมจากเซิร์ฟเวอร์
  protected readonly approvalRequests = signal<ApprovalRequest[]>([]);
  protected readonly selectedIds = signal<number[]>([]);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly isApproveMode = signal<boolean>(true); // true = ออนุมัติ, false = ไม่อนุมัติ
  protected readonly loading = signal<boolean>(false);

  protected commentReason = '';
  protected readonly ApprovalStatus = ApprovalStatus;

  // 1. ตัวกรองการค้นหาและสถานะ (รองรับเลือกหลายสถานะพร้อมกัน)
  protected readonly searchQuery = signal<string>('');
  protected readonly statusFilters = signal<string[]>(['all']); // ['all'] หรือรายการของ ['pending', 'approved', 'rejected']

  // 2. สถานะการเรียงลำดับ (Sorting)
  protected readonly sortColumn = signal<string>('createdAt');
  protected readonly sortAscending = signal<boolean>(false); // เรียงตามล่าสุดก่อนเป็นหลัก (desc)

  // 3. สถานะการแบ่งหน้า (Paging)
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(10);

  // คำนวณกรองข้อมูลตามคำค้นหาและสถานะที่เลือก
  protected readonly filteredRequests = computed(() => {
    let requests = this.approvalRequests();
    const query = this.searchQuery().toLowerCase().trim();
    const filters = this.statusFilters();

    // กรองด้วยคำค้นหาเสิร์ชบาร์
    if (query) {
      requests = requests.filter(r => 
        r.title.toLowerCase().includes(query) || 
        (r.reason && r.reason.toLowerCase().includes(query))
      );
    }

    // กรองด้วยกลุ่มสถานะที่เลือก
    if (!filters.includes('all')) {
      const allowedStatuses: number[] = [];
      if (filters.includes('pending')) allowedStatuses.push(ApprovalStatus.Pending);
      if (filters.includes('approved')) allowedStatuses.push(ApprovalStatus.Approved);
      if (filters.includes('rejected')) allowedStatuses.push(ApprovalStatus.Rejected);

      requests = requests.filter(r => allowedStatuses.includes(r.status));
    }

    return requests;
  });

  // คำนวณเรียงลำดับข้อมูลที่ผ่านการกรองแล้ว
  protected readonly sortedRequests = computed(() => {
    let requests = [...this.filteredRequests()];
    const col = this.sortColumn();
    const asc = this.sortAscending();

    requests.sort((a, b) => {
      let valA: any = a[col as keyof ApprovalRequest] ?? '';
      let valB: any = b[col as keyof ApprovalRequest] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });

    return requests;
  });

  // แบ่งหน้าข้อมูลที่กรองและเรียงลำดับแล้ว
  protected readonly pagedRequests = computed(() => {
    const requests = this.sortedRequests();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return requests.slice(start, start + size);
  });

  // คำนวณหน้าทั้งหมด
  protected readonly totalPages = computed(() => {
    const total = this.filteredRequests().length;
    return Math.ceil(total / this.pageSize()) || 1;
  });

  ngOnInit(): void {
    this.fetchData();
  }

  protected fetchData(): void {
    this.loading.set(true);
    this.approvalService.getAll().subscribe({
      next: (res) => {
        this.approvalRequests.set(res);
        this.selectedIds.set([]); // เคลียร์ปุ่มเช็คบ็อกซ์เดิม
        this.currentPage.set(1);  // กลับไปหน้าแรกเสมอ
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load approval requests', err);
        this.loading.set(false);
      }
    });
  }

  // เช็คสถานะการเลือกฟิลเตอร์
  protected isStatusSelected(status: string): boolean {
    return this.statusFilters().includes(status);
  }

  // กดเลือก/ยกเลิกฟิลเตอร์สถานะ
  protected toggleStatusFilter(status: string): void {
    this.statusFilters.update(filters => {
      if (status === 'all') {
        return ['all'];
      }

      // นำ 'all' ออกเมื่อเลือกข้ออื่นเจาะจง
      let newFilters = filters.filter(f => f !== 'all');

      if (newFilters.includes(status)) {
        newFilters = newFilters.filter(f => f !== status);
      } else {
        newFilters.push(status);
      }

      // หากไม่ได้เลือกข้อใดเลย ให้กลับมาติ๊กข้อ 'ทั้งหมด'
      if (newFilters.length === 0) {
        return ['all'];
      }

      return newFilters;
    });
    this.currentPage.set(1); // รีเซ็ตหน้าแรก
  }

  // เลือกหรือยกเลิกแถวนั้น ๆ
  protected toggleSelection(id: number): void {
    this.selectedIds.update((ids) => {
      if (ids.includes(id)) {
        return ids.filter(x => x !== id);
      } else {
        return [...ids, id];
      }
    });
  }

  // เลือกหรือเคลียร์เช็คบ็อกซ์ทั้งหมด (เฉพาะรายการ 'รออนุมัติ' ของหน้าปัจจุบัน)
  protected toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentPagePendingIds = this.pagedRequests()
      .filter(x => x.status === this.ApprovalStatus.Pending)
      .map(x => x.id);

    if (isChecked) {
      this.selectedIds.update(ids => {
        const newIds = [...ids];
        currentPagePendingIds.forEach(id => {
          if (!newIds.includes(id)) newIds.push(id);
        });
        return newIds;
      });
    } else {
      this.selectedIds.update(ids => ids.filter(id => !currentPagePendingIds.includes(id)));
    }
  }

  // ตรวจสอบเช็คบ็อกซ์หลักของหน้าปัจจุบัน
  protected get isAllPendingSelected(): boolean {
    const currentPagePending = this.pagedRequests().filter(x => x.status === this.ApprovalStatus.Pending);
    if (currentPagePending.length === 0) return false;
    return currentPagePending.every(x => this.selectedIds().includes(x.id));
  }

  protected get hasSelection(): boolean {
    return this.selectedIds().length > 0;
  }

  // เรียงลำดับคอลัมน์
  protected changeSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortAscending.update(val => !val);
    } else {
      this.sortColumn.set(column);
      this.sortAscending.set(true);
    }
    this.currentPage.set(1); // ย้อนกลับมาหน้า 1
  }

  // เปลี่ยนหน้า
  protected setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // เปลี่ยนจำนวนรายการต่อหน้า
  protected onPageSizeChange(newSize: number): void {
    this.pageSize.set(newSize);
    this.currentPage.set(1); // ย้อนกลับมาหน้า 1 เสมอเมื่อเปลี่ยนขนาดหน้า
  }

  // รีเซ็ตหน้าเมื่อมีการค้นหา
  protected onSearchChange(): void {
    this.currentPage.set(1);
  }

  // ดึงค่าน้อยสุดสำหรับป้ายระบุหน้า
  protected mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  protected openDecisionModal(isApprove: boolean): void {
    this.isApproveMode.set(isApprove);
    this.commentReason = '';
    this.isModalOpen.set(true);
  }

  protected closeDecisionModal(): void {
    this.isModalOpen.set(false);
    this.commentReason = '';
  }

  protected submitDecision(): void {
    if (!this.commentReason.trim()) {
      alert('กรุณากรอกเหตุผลก่อนดำเนินการ');
      return;
    }

    this.loading.set(true);
    this.approvalService.approveOrReject({
      ids: this.selectedIds(),
      approve: this.isApproveMode(),
      reason: this.commentReason
    }).subscribe({
      next: () => {
        this.closeDecisionModal();
        this.fetchData(); // อัปเดตข้อมูลขึ้นหน้าจอ
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาด', err);
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        this.loading.set(false);
      }
    });
  }
}
