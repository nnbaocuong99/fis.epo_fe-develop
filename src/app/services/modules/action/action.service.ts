import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api/treenode';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { HttpService } from '../../common';
import { RequestPayload } from '../../common/http/request-payload.model';

@Injectable({
    providedIn: 'root'
})

export class ActionService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'action';
    }

    public selectActionInOut(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(this.url + '/select-action-in-out',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public countActionInOut(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<any[]> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<any[]>(this.url + '/count-action-in-out',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectResourceRestricted(request: any, isSpinner?: boolean): Observable<any[]> {
        return this.intercept(this.httpClient.get<any[]>(this.url + '/select-resource-restricted',
            { observe: 'response', headers: this.getHeaders(), params: this.toParams(request) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public mergeResourceRestricted(body: any, isSpinner?: boolean): Observable<boolean> {
        return this.intercept(this.httpClient.post<boolean>(`${this.url}/merge-resource-restricted`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    /**
     * Get tree data from flat data
     */
    public getTreeView(source: any[]): TreeNode[] {
        const treeData = [];
        for (const item of source) {
            if (!item.parentId) {
                const parentNode: TreeNode = {
                    label: item.name,
                    data: item,
                    expanded: false,
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
            const childData = source.filter(x => x.parentId === parentNode.data.id);
            if (childData.length > 0) {
                const childNodeData: TreeNode[] = [];
                for (const item of childData) {
                    const childNode: TreeNode = {};
                    childNode.data = item;
                    childNode.label = item.name;
                    childNode.expanded = false;
                    childNode.partialSelected = false;
                    childNodeData.push(childNode);
                }

                parentNode.children = childNodeData;
                this.getSub(source, parentNode.children);
            }
        }
    }
}
