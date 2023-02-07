import { ChangeDetectorRef, Component, EventEmitter, forwardRef, OnInit, Output, ViewChild, ViewRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { CompanyService } from '../../../../services/modules/category/company/company.service';
import { DepartmentService } from '../../../../services/modules/category/department/department.service';

export const SELECT_SUBDEPARTMENT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectSubdepartmentTreeComponent),
  multi: true
};

@Component({
  selector: 'app-select-subdepartment-tree',
  templateUrl: './select-subdepartment-tree.component.html',
  styleUrls: ['./select-subdepartment-tree.component.scss'],
  providers: [SELECT_SUBDEPARTMENT_CONTROL_VALUE_ACCESSOR]
})
export class SelectSubdepartmentTreeComponent extends BaseComponent implements OnInit {

  @ViewChild('tree', { static: true }) tree: Tree;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  public treeData: TreeNode[] = [];
  public selected = [];
  public listCompany = [];
  public listSubDepartment = [];

  constructor(
    public companyService: CompanyService,
    public departmentService: DepartmentService,
    public cdr: ChangeDetectorRef
  ) {
    super();
  }

  public value: any = null;
  public keyword: string = null;

  writeValue(value: any) {
    this.selected = [];
    if (this.cdr && !(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  ngOnInit() {
    this.initData();
  }

  public onSelectionChange(event: any): void {
    const temp = this.selected.filter(m => m.data && m.data.subDepartmentId);
    const list = temp.map(({ data }) => data.subDepartmentId);
    this.value = list;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  public search(): void {
    this.selected = [];
    this.onSelectionChange(null);
    if (this.keyword) {
      const listSubDepartment = this.listSubDepartment.filter(m => m.name && m.name.trim().toLowerCase().includes(this.keyword.trim().toLowerCase()))
      this.getTreeView(this.listCompany, listSubDepartment, true);
    } else {
      this.getTreeView(this.listCompany, this.listSubDepartment, false);
    }
  }

  initData(): void {
    const requests = [
      this.companyService.select(),
      this.departmentService.select()
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.listCompany = response[0];
        this.listSubDepartment = response[1];
        this.getTreeView(this.listCompany, this.listSubDepartment);
      });
    this.subscriptions.push(sub);
  }

  public getTreeView(listCompany: any[], listSubDepartment: any[], isSearch: boolean = false): void {
    const treeData = [];
    for (const item of listCompany) {
      const parentNode: TreeNode = {
        label: item.name,
        data: null,
        expandedIcon: 'fas fa-folder-open folder-explorer',
        collapsedIcon: 'fas fa-folder folder-explorer',
        expanded: isSearch,
        partialSelected: false
      };
      parentNode.children = this.getSubAcronym(listSubDepartment, item, isSearch);
      if (parentNode.children && parentNode.children.length > 0) {
        treeData.push(parentNode);
      }
    }
    this.treeData = treeData;
    this.cdr.detectChanges();
  }

  distinct(value, index, self) {
    return self.indexOf(value) === index;
  }

  private getSubAcronym(source: any[], parent: any, isSearch: boolean = false): any {
    const childData = source.filter(m => m.companyCode === parent.code && m.acronym).map(m => m.acronym).filter(this.distinct);
    if (childData.length > 0) {
      const childNodeData: TreeNode[] = [];
      for (const item of childData) {
        const childNode: TreeNode = {};
        childNode.data = null;
        childNode.label = item;
        childNode.expandedIcon = 'fas fa-folder-open folder-explorer';
        childNode.collapsedIcon = 'fas fa-folder folder-explorer';
        childNode.expanded = isSearch;
        childNode.partialSelected = false;
        childNode.children = this.getSub(source, item, parent);
        if (childNode.children && childNode.children.length > 0) {
          childNodeData.push(childNode);
        }
      }
      return childNodeData;
    }
    return null;
  }

  private getSub(source: any[], parent: string, parentOrigin: any): any {
    const childData = source.filter(m => m.companyCode === parentOrigin.code && m.acronym === parent);
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
      return childNodeData;
    }
    return null;
  }

}
