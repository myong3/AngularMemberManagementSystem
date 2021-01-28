import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Md5 } from 'ts-md5';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { checkAccountModel, signUpModel } from './signup.component.models';
import { Ids } from './signup.component.ids';
import { NgForm } from '@angular/forms';
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
  account = '';
  password = '';
  checkpassword = '';
  message = '';
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

  checkAccount() {
    if (this.getValue(Ids.account).trim() === '') {
      return;
    }
    const url = this.baseUrl + 'api/signup/checkaccount';
    const postData = new checkAccountModel(this.getValue(Ids.account));

    this.http.post<boolean>(url, postData, this.httpOptions).subscribe(
      (result) => {
        if (result) {
          this.setFocus(Ids.account);
          this.message = '此帳號已被註冊，請使用其他帳號';
        } else {
          this.message = '';
        }
      },
      (error) => console.error(error)
    );
    return false;
  }

  checkPassword() {
    if (this.getValue(Ids.password) !== this.getValue(Ids.checkpassword)) {
      this.setFocus(Ids.checkpassword);
      this.message = '您輸入的兩個密碼並不相符，請再試一次';
    } else {
      this.message = '';
    }
  }

  signupFunction() {
    if (this.getValue(Ids.account).trim() === '') {
      this.message = '請輸入帳號';
      this.setFocus(Ids.account);

      return;
    } else if (this.getValue(Ids.password).trim() === '') {
      this.message = '請輸入註冊密碼';
      this.setFocus(Ids.password);

      return;
    }
    if (this.getValue(Ids.checkpassword).trim() === '') {
      this.message = '請輸入第二次註冊密碼';
      this.setFocus(Ids.checkpassword);

      return;
    }

    const salt = this.createSalt();
    const PasswordWithSalt = salt + this.password;
    const passwordMd5 = Md5.hashStr(PasswordWithSalt).toString();
    console.log('account', this.account);
    console.log('password', this.password);
    console.log('salt', salt);
    console.log('PasswordWithSalt', PasswordWithSalt);
    console.log('passwordMd5', passwordMd5);

    const url = this.baseUrl + 'api/signup/signup';
    const postData = new signUpModel();
    postData.userAccount = this.getValue(Ids.account);
    postData.userPassword = passwordMd5;
    postData.userPasswordSalt = salt;

    this.http.post<number>(url, postData, this.httpOptions).subscribe(
      (result) => {
        const options = {
          autoClose: true,
          keepAfterRouteChange: true,
        };
        this.alertService.success('註冊成功', options);
        this.router.navigate(['..', this.path.home]);
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

  /**
   * 取得密碼加密salt
   */
  createSalt() {
    const possible =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]=-|}{)(*&^%$#@!?~`";
    const lengthOfCode = 8;
    let text = '';
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
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
