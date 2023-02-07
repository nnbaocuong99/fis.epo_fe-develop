import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';
import { HttpService } from '../../common';

@Injectable({
    providedIn: 'root'
})

export class OrgChartService extends HttpService {
    public treeData: TreeNode[] = [];

    constructor() {
        super();
        this.url = this.origin + 'org-chart';
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
                        label: item.orgName,
                        data: item,
                        expandedIcon: 'fas fa-folder-open folder-explorer',
                        collapsedIcon: 'fas fa-folder folder-explorer',
                        expanded: true,
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
                    childNode.label = item.orgName;
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
}
