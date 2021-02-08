import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { checkAccountModel, signUpModel } from './signup.component.models';
import { Ids } from './signup.component.ids';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { appPath } from '../app-path.const';
import { AlertService } from '../_alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  path = appPath;
  baseUrl = 'https://localhost:44329/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',

    }),
    // observe: 'response' as 'response'
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
    this.Form = this.formBuilder.group({
      account: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', Validators.required],
      checkpassword: ['', Validators.required],
    });
  }

  checkAccount() {
    if (this.Form.get(Ids.account).value.trim() === '') {
      this.setFocus(Ids.account);
      return;
    } else if (!this.Form.get(Ids.account).valid) {
      this.setFocus(Ids.account);
      return;
    }
    const url = this.baseUrl + 'api/signup/checkaccount';
    const postData = new checkAccountModel(
      this.Form.get(Ids.account).value.trim()
    );

    this.http.post<boolean>(url, postData, this.httpOptions).subscribe(
      (result) => {
        if (result) {
          this.setFocus(Ids.account);
          const options = {
            autoClose: true,
            keepAfterRouteChange: true,
          };
          this.alertService.error('此帳號已被註冊，請使用其他帳號', options);
        }
      },
      (error) => console.error(error)
    );
    return false;
  }

  checkPassword() {
    if (
      this.Form.get(Ids.password).value !==
      this.Form.get(Ids.checkpassword).value
    ) {
      this.setFocus(Ids.checkpassword);
      const options = {
        autoClose: true,
        keepAfterRouteChange: true,
      };
      this.alertService.error('您輸入的兩個密碼並不相符，請再試一次', options);
    }
  }

  signupFunction() {
    if (!this.Form.valid) {
      return;
    }

    const url = this.baseUrl + 'api/signup/signup';
    const postData = new signUpModel();
    postData.userAccount = this.Form.get(Ids.account).value.trim();
    postData.userPassword = this.Form.get(Ids.password).value.trim();

    this.http.post<number>(url, postData, this.httpOptions).subscribe(
      (result) => {
        const options = {
          autoClose: true,
          keepAfterRouteChange: true,
        };
        this.alertService.success('註冊成功', options);
        this.router.navigate(['..', this.path.login]);
      },
      (error) => {
        const options = {
          autoClose: true,
          keepAfterRouteChange: true,
        };
        console.error(error);
        this.alertService.error('註冊失敗，請再嘗試一次', options);
      }
    );
  }

  // /**
  //  * 取得密碼加密salt
  //  */
  // createSalt() {
  //   const possible =
  //     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]=-|}{)(*&^%$#@!?~`";
  //   const lengthOfCode = 8;
  //   let text = '';
  //   for (let i = 0; i < lengthOfCode; i++) {
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   }
  //   return text;
  // }

  setFocus(name) {
    const ele = this.formElementRef.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  get account() {
    return this.Form.get('account');
  }

  get password() {
    return this.Form.get('password');
  }

  get checkpassword() {
    return this.Form.get('checkpassword');
  }
}
