import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { appPath } from '../app-path.const';
import { Md5 } from 'ts-md5';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AlertService } from '../_alert';
import { Router } from '@angular/router';
import {
  GetPasswordModel,
  GetPasswordReturnModel,
} from './login.component.models';
import { Ids } from '../signup/signup.component.ids';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  account = '';
  password = '';
  path = appPath;
  isChecked = false;
  baseUrl = 'https://localhost:44329/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  @ViewChild('form') formElementRef: ElementRef;
  @ViewChild('f') f: NgForm;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  loginFunction() {
    const url = this.baseUrl + 'api/login/GetPassword';
    const postData = new GetPasswordModel(this.getValue(Ids.account));

    this.http
      .post<GetPasswordReturnModel>(url, postData, this.httpOptions)
      .subscribe(
        (result) => {
          console.log('result', result);

          if (result.userPassword !== null) {
            this.comparePassword(result);
          } else {
            const options = {
              autoClose: true,
              keepAfterRouteChange: true,
            };
            this.alertService.error('找不到您的帳戶，請再嘗試一次', options);
          }
        },
        (error) => {
          const options = {
            autoClose: true,
            keepAfterRouteChange: true,
          };
          console.error(error);
          this.alertService.error('登入失敗，請再嘗試一次', options);
        }
      );
  }

  comparePassword(model: GetPasswordReturnModel) {
    const password = this.getValue(Ids.password);
    const passwordWithSalt = model.userPasswordSalt + password;
    const passwordMd5 = Md5.hashStr(passwordWithSalt).toString();

    console.log('password', password);
    console.log('passwordWithSalt', passwordWithSalt);
    console.log('passwordMd5', passwordMd5);
    if (passwordMd5 === model.userPassword) {
      const options = {
        autoClose: true,
        keepAfterRouteChange: true,
      };
      this.alertService.success('登入成功', options);
      this.router.navigate(['..', this.path.home]);
    } else {
      const options = {
        autoClose: true,
        keepAfterRouteChange: true,
      };
      this.alertService.error('密碼錯誤', options);
    }
  }

  setFocus(name) {
    const ele = this.formElementRef.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  setValue(name, value) {
    this.f.form.get(name).setValue(value);
  }

  getValue(name) {
    return this.f.form.get(name).value;
  }
}
