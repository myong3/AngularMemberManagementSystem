import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { appPath } from '../app-path.const';
import { Md5 } from 'ts-md5';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AlertService } from '../_alert';
import { Router } from '@angular/router';
import {
  LogInRepsonseModel,
  LogInRequestModel,
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
    withCredentials: true,
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

    const token = sessionStorage.getItem('access_token');

    if (token !== undefined && token !== null) {
      this.router.navigate([this.path.home]);
    }
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

    const url = this.baseUrl + 'api/login/LogInGetToken';
    const postData = new LogInRequestModel();

    postData.userAccount = this.Form.get(Ids.account).value;
    postData.userPassword = this.Form.get(Ids.password).value;

    this.http
      .post<LogInRepsonseModel>(url, postData, this.httpOptions)
      .subscribe(
        (result) => {
          if (result.isSuccessLogIn === true) {
            sessionStorage.setItem('access_token', result.access_token);
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
            this.alertService.error(result.message, options);
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

  setFocus(name) {
    const ele = this.formElementRef.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }
}
