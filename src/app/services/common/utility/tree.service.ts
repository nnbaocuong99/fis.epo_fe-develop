import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng';

@Injectable()
export class TreeService {
    constructor() {
    }

    public getNodeByIdsFromTreeData(treeData: TreeNode[], ids: string[], isSubNode?: boolean) {
        const result: TreeNode[] = [];

        for (let node of treeData) {
            node.data.countSelected = 0;
            const index = ids.findIndex(x => x === node.data.id);
            if (index > -1) {
                result.push(node);
                ids.splice(index, 1);
                if (!isSubNode) {
                    node.data.countSelected++;
                }
            }

            if (node.children && node.children.length > 0) {
                const childResult = this.getNodeByIdsFromTreeData(node.children, ids, true);
                if (childResult.length > 0) {
                    result.push(...childResult);
                    node.data.countSelected = node.data.countSelected + childResult.length;
                }
            }
        }

        return result;
    }
}
