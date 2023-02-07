import { Component, OnInit } from '@angular/core';
import * as config from './customer.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { CustomerService } from '../../../../services/modules/category/customer/customer.service';
import { CustomerRequestPayload } from '../../../../services/modules/category/customer/customer.request.payload';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent extends BaseListComponent implements OnInit {
  constructor(
    public customerService: CustomerService) {
    super();
  }

  ngOnInit() {
    this.pageSizeDefault = 10;
    this.baseService = this.customerService;
    this.headers = config.HEADER;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new CustomerRequestPayload();
    this.formTitle = 'CUSTOMER.HEADER_LIST';
    super.ngOnInit();
  }
}
