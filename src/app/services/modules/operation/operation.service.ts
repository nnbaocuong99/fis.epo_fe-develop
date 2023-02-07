import { Injectable } from '@angular/core';
import { HttpService } from '../../common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestPayload } from '../../common/http/request-payload.model';
import { TreeNode } from 'primeng/api';
import { BaseResponse } from '../../common/http/base-response.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class OperationService extends HttpService {

    constructor() {
        super();
        this.url = this.origin + 'operation';
    }

    /**
     * Get tree data from flat data
     */
    public getTreeViewMenu(isShowOnlyMenu: boolean): Observable<TreeNode[]> {
        return this.select().pipe(map(response => {
            if (isShowOnlyMenu) {
                response = response.filter(x => x.method !== 'VIEW');
            }
            const treeData = [];
            for (const item of response) {
                if (!item.parentMenu) {
                    const parentNode: TreeNode = {
                        label: item.name,
                        data: item,
                        expandedIcon: 'fas fa-folder-open folder-explorer',
                        collapsedIcon: 'fas fa-folder folder-explorer',
                        expanded: false,
                        partialSelected: false
                    };
                    this.setIconForNode(parentNode);
                    treeData.push(parentNode);
                }
            }
            this.getSub(response, treeData);
            return treeData;
        }));
    }

    /**
     * Get tree data from flat data
     */
    public getTreeViewMenuSelected(source: any[]): TreeNode[] {
        const treeData = [];
        for (const item of source) {
            if (!item.parentMenu) {
                const parentNode: TreeNode = {
                    label: item.name,
                    data: item,
                    expandedIcon: 'fas fa-folder-open folder-explorer',
                    collapsedIcon: 'fas fa-folder folder-explorer',
                    expanded: true,
                    partialSelected: false
                };
                treeData.push(parentNode);
            }
        }
        this.getSub(source, treeData);
        return treeData;
    }

    /**
     * Get subsidiary item
     */
    private getSub(source: any[], parentNodes: TreeNode[]): void {
        for (const parentNode of parentNodes) {
            const childData = source.filter(x => x.parentMenu === parentNode.data.id);
            if (childData.length > 0) {
                const childNodeData: TreeNode[] = [];
                for (const item of childData) {
                    const childNode: TreeNode = {};
                    childNode.data = item;
                    childNode.label = item.name;
                    childNode.expanded = false;
                    childNode.partialSelected = false;
                    this.setIconForNode(childNode);
                    childNodeData.push(childNode);
                }

                parentNode.children = childNodeData;
                this.getSub(source, parentNode.children);
            } else {
                this.setIconForNode(parentNode, true);
            }
        }
    }

    public setIconForNode(node: any, isChild?: boolean) {
        if (node && node.data.method === 'VIEW') {
            node.expandedIcon = 'fas fa-circle';
            node.collapsedIcon = 'fas fa-circle';
        }

        if (node && node.data.method === 'MODULE') {
            node.expandedIcon = 'fas fa-md fa-folder-open folder-explorer';
            node.collapsedIcon = 'fas fa-md fa-folder folder-explorer';
        }

        if (node && node.data.method === 'MENU') {
            node.expandedIcon = 'fal fa-md fa-desktop';
            node.collapsedIcon = 'fal fa-md fa-desktop';
        }
    }

    public getMenuByUser(isSpinner?: boolean): Observable<any[]> {
        return this.intercept(this.httpClient.get<any[]>(this.url + '/get-menu-by-user',
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectByParentMenu(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(this.url + "/get-menu-by-parent-menu",
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public bulkMergeAction(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/bulk-merge-action`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public bulkDeleteByIds(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<any> {
        return this.intercept(this.httpClient.post<any>(`${this.url}/bulk-delete`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }
    public selectActionById(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(this.url + "/get-action-by-operation",
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

}
