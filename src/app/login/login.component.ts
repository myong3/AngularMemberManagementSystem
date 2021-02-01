import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { appPath } from '../app-path.const';
import { Md5 } from 'ts-md5';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
  // baseData = { account: '', password: '' };
  path = appPath;
  isChecked = false;
  baseUrl = 'https://localhost:44329/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  Form: FormGroup;

  @ViewChild('form') formElementRef: ElementRef;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.Form = new FormGroup({
    //   account: new FormControl(this.baseData.account, [
    //     Validators.required,
    //     Validators.minLength(4),
    //   ]),
    //   password: new FormControl(this.baseData.password, [Validators.required]),
    // });

    this.Form = this.formBuilder.group({
      account: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', Validators.required],
    });
  }

  get account() {
    return this.Form.get('account');
  }

  get password() {
    return this.Form.get('password');
  }

  loginFunction() {
    if (!this.Form.valid) {
      return;
    }
    const url = this.baseUrl + 'api/login/GetPassword';
    const postData = new GetPasswordModel(this.Form.get(Ids.account).value);

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
    const password = this.Form.get(Ids.password).value;
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
}
