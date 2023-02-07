import { Component, OnInit } from '@angular/core';
import * as config from './organization-management.config';

@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent implements OnInit {
  public formTitle = 'ORGANIZATION.HEADER_LIST';
  public tabs = config.TABS;
  public showOrganizationTab = false;
  public showSubIventory = false;
  public currentTab: number;
  constructor() { }

  ngOnInit() {
    this.currentTab = 1;
  }

  public setFragmentToRoute(event): void {
    this.currentTab = event.nextId;
  }
}
