import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class AfGroupService extends HttpService {
    public treeData: TreeNode[] = [];

    constructor() {
        super();
        this.url = this.origin + 'af-group';
    }

    /**
     * Get tree data from flat data
     */
    public getTreeView(): Observable<TreeNode[]> {
        return this.select().pipe(map(response => {
            const treeData = [];
            for (const item of response) {
                if (!item.parentId) {
                    const parentNode: TreeNode = {
                        label: item.name,
                        data: item,
                        expandedIcon: 'fas fa-folder-open folder-explorer',
                        collapsedIcon: 'fas fa-folder folder-explorer',
                        expanded: false,
                        partialSelected: false
                    };
                    treeData.push(parentNode);
                }
            }
            this.getSub(response, treeData);
            this.treeData = treeData;
            return treeData;
        }));
    }

    /**
     * Get subsidiary item
     */
    private getSub(source: any[], parentNodes: TreeNode[]): void {
        for (const parentNode of parentNodes) {
            const childData = source.filter(x => x.parentId === parentNode.data.id);
            if (childData.length > 0) {
                const childNodeData: TreeNode[] = [];
                for (const item of childData) {
                    const childNode: TreeNode = {};
                    childNode.data = item;
                    childNode.label = item.name;
                    childNode.expandedIcon = 'fas fa-folder-open folder-explorer';
                    childNode.collapsedIcon = 'fas fa-folder folder-explorer';
                    childNode.expanded = false;
                    childNode.partialSelected = false;
                    childNodeData.push(childNode);
                }
                parentNode.children = childNodeData;
                this.getSub(source, parentNode.children);
            }
        }
    }

    public mergeSubRoleUser(body: any, isSpinner?: boolean, params?: any): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/merge-sub-role-user`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectUserAssignedSubDepartment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any>(this.url + '/select-user-assigned-sub-department',
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countUserAssignedSubDepartment(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<number> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<number>(this.url + '/count-user-assigned-sub-department',
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(requestPayload) }), isSpinner)
            .pipe(map(r => r.body));
    }

}
