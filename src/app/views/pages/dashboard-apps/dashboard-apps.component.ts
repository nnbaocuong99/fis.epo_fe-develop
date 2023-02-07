import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/_services/auth.service';


@Component({
  selector: 'app-dashboard-apps',
  templateUrl: './dashboard-apps.component.html',
  styleUrls: ['./dashboard-apps.component.scss']
})
export class DashboardAppsComponent implements OnInit {

  public origin: string;
  public srcImage: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.origin = window.location.origin;
    this.srcImage = this.origin + '/assets/media/add-new/ecommerce-image.png'
    if (window.location.hostname === 'insight.fis.com.vn') {
      this.srcImage = this.origin + '/epo/assets/media/add-new/ecommerce-image.png'
    }
  }

}
