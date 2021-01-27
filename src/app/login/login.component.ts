import { Component, OnInit } from '@angular/core';
import { appPath } from '../app-path.const';
import { Md5 } from 'ts-md5';

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

  constructor() {}

  ngOnInit(): void {}

  loginFunction() {


  }

}
