import { Component } from '@angular/core';
import { appPath } from './app-path.const';
import { AlertService } from './_alert';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'MemberManagementSystem';
  path = appPath;
  decodeToken : any;
  constructor(
    private alertService: AlertService,
    private jwtHelperService: JwtHelperService,
    private router: Router
  ) {}

  /** 是否有權限 */
  isPolicy() {
    if (sessionStorage.getItem('userPolicy') === 'true') {
      return true;
    }
    return false;
  }

  decodeUserFromToken() {
    const token = sessionStorage.getItem('access_token');

    if (token !== undefined && token !== null) {
      this.decodeToken = this.jwtHelperService.decodeToken(token);
      if ((this.decodeToken.exp as number) < Math.floor(Date.now() / 1000)) {
        sessionStorage.removeItem('access_token');
        const options = {
          autoClose: true,
          keepAfterRouteChange: true,
        };
        this.alertService.success('已自動為您登出，請再重新登入', options);
        this.router.navigate([this.path.login]);

        return false;
      }

      if (this.decodeToken.roles === 'Admin') {
        return true;
      } else if (this.decodeToken.roles === 'User') {
        return false;
      }
    } else {
      return false;
    }
  }

  /** 是否已經登入 */
  isLogin() {
    const token = sessionStorage.getItem('access_token');

    if (token !== undefined && token !== null) {
      return true;
    } else {
      return false;
    }
  }

  /** 登出 */
  logout() {
    sessionStorage.removeItem('access_token');

    const options = {
      autoClose: true,
      keepAfterRouteChange: true,
    };
    this.alertService.success('登出成功', options);
    this.router.navigate([this.path.home]);
  }
}
