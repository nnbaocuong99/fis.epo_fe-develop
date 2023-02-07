import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpService } from '../../common';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { ContractRequestPayload, EContractRequestPayload, EContractResponseDto } from './contract.request.payload';
import { BaseResponse } from '../../common/http/base-response.model';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class ContractService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'contract/search-econtract';
    }

    public interceptCustom(observable: Observable<HttpResponse<any>>, isSpinner?: boolean, errorMessage?: string): Observable<HttpResponse<any>> {
        if (isSpinner == null || isSpinner === undefined) { isSpinner = true; }
        if (isSpinner) { this.showSpinner(); }
        return observable
            .pipe(tap(() => {
                if (window.window.name === 'epo-windowlogin') {
                    window.close();
                }
            }, (err: HttpErrorResponse) => {
                this.notification.showError(errorMessage);
            }), finalize(() => {
                if (isSpinner) { this.hideSpinner(); }
            }));
    }

    public searchEContract(requestPayload?: EContractRequestPayload, isSpinner?: boolean): Observable<any> {
        return this.interceptCustom(this.httpClient.get<any[]>(`${this.url}`,
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner, 'Không thể kết nối đến hệ thống eContract')
            .pipe(map(r => r.body));
    }

    public searchProjectFromJira(requestPayload?: EContractRequestPayload, isSpinner?: boolean): Observable<any> {
        return this.interceptCustom(this.httpClient.get<any[]>(`${this.origin}contract/search-project-from-jira`,
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner, 'Không thể kết nối đến hệ thống Jira')
            .pipe(map(r => r.body));
    }

    public select(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(`${this.origin}contract`,
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public merge(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.origin}contract/merge`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectById(id: string, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(`${this.origin}contract/${id}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectByContractId(id: string, isSpinner?: boolean): Observable<any> {
        return this.intercept(this.httpClient.get<any>(`${this.origin}contract/select-by-contract-id/${id}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public syncContract(purchaseOrderData: any, projectCode: string) {
        const requestContract = new ContractRequestPayload();
        requestContract.accountingCode = projectCode;
        this.select(requestContract).subscribe(
            (m: any) => {
                if (m && m.length > 0) {
                    purchaseOrderData.amAccount = m[0].amAccount;
                    purchaseOrderData.contractNo = m[0].contractNo;
                } else {
                    const requestEContract = new EContractRequestPayload();
                    requestEContract.eqAccountingCode = projectCode;
                    requestEContract.pageIndex = 0;
                    requestEContract.pageSize = 10;
                    this.searchEContract(requestEContract).subscribe(
                        (res: any) => {
                            if (res && res.records && res.records.length > 0) {
                                const dataContract = res.records[0];
                                this.selectByContractId(dataContract.id).subscribe(m2 => {
                                    if (!m2) {
                                        const contractSave: any = {};
                                        contractSave.contractNo = dataContract.numberOfContract;
                                        contractSave.contractDescription = dataContract.description;
                                        contractSave.contractType = dataContract.productTypeText;
                                        contractSave.ceoCoo = dataContract.ceoFisx;
                                        contractSave.signDate = dataContract.signDate;
                                        contractSave.endDate = dataContract.endDate;
                                        contractSave.amAccount = dataContract.am;
                                        contractSave.pmAccount = dataContract.pm;
                                        //
                                        contractSave.contractId = dataContract.id;
                                        contractSave.contractTypeText = dataContract.productTypeText;
                                        contractSave.customerDetail = dataContract.customerDetails;
                                        contractSave.accountingCode = dataContract.afContractId;
                                        contractSave.projectCode = dataContract.afContractId;

                                        this.merge(contractSave).subscribe((resSave: any) => {
                                            if (!resSave || !resSave.id) {
                                                purchaseOrderData.projectCode = null;
                                                purchaseOrderData.projectCodeDto = null;
                                            } else {
                                                purchaseOrderData.amAccount = resSave.amAccount;
                                                purchaseOrderData.contractNo = resSave.contractNo;
                                            }
                                        }, (err: HttpErrorResponse) => {
                                            purchaseOrderData.projectCode = null;
                                            purchaseOrderData.projectCodeDto = null;
                                        });
                                    } else {
                                        purchaseOrderData.amAccount = m2[0].amAccount;
                                        purchaseOrderData.contractNo = m2[0].contractNo;
                                    }
                                });
                            } else {
                                purchaseOrderData.projectCode = null;
                                purchaseOrderData.projectCodeDto = null;
                                this.notification.showWarning(`Không tìm thấy mã dự án ${projectCode} trên hệ thống eContract`);
                            }
                        },
                        (err: HttpErrorResponse) => {
                            purchaseOrderData.projectCode = null;
                            purchaseOrderData.projectCodeDto = null;
                        });
                }
            },
            (err: HttpErrorResponse) => {
                purchaseOrderData.projectCode = null;
                purchaseOrderData.projectCodeDto = null;
                this.notification.showError(err.error.toString());
            }
        );
    }
}
