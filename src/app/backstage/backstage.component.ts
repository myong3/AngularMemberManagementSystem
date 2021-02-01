import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-backstage',
  templateUrl: './backstage.component.html',
  styleUrls: ['./backstage.component.css'],
})
export class BackstageComponent implements OnInit {
  // baseData = { account: '', password: '' };
  isChecked = false;
  Form: FormGroup;

  @ViewChild('form') formElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder) {}

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


  click() {
    console.log('this.Form.valid', this.Form.valid);
    console.log('get account', this.Form.get('account').value);
    console.log('get password', this.Form.get('password').value);

    if (!this.Form.valid) {
      this.setFocus('password');
      return;
    }
  }

  setFocus(name) {
    const ele = this.formElementRef.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }
}
