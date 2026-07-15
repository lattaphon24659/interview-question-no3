import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApprovalCommand, ApprovalRequest } from '../models/approval-request.model';

@Injectable({
    providedIn: 'root'
})
export class ApprovalService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:9002/api/approval';

    getAll(): Observable<ApprovalRequest[]> {
        return this.http.get<ApprovalRequest[]>(this.apiUrl);
    }

    approveOrReject(command: ApprovalCommand): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/approve-or-reject`, command);
    }
}
