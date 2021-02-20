import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { appPath } from '../app-path.const';
import {
  DeleteModel,
  UpdateModel,
  UserResponseModel,
  UserResponseViewModel,
} from './backstage.component.models';
@Component({
  selector: 'app-backstage',
  templateUrl: './backstage.component.html',
  styleUrls: ['./backstage.component.css'],
})
export class BackstageComponent implements OnInit {
  decodeToken: any; // 目前登入者token資料
  path = appPath;
  baseUrl = 'https://localhost:44329/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };
  listData: Array<UserResponseModel>; // 會員資料

  @ViewChild('form') formElementRef: ElementRef;

  constructor(
    private router: Router,
    private jwtHelperService: JwtHelperService,
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.DecodeTokenFuntcion();
    if (this.decodeToken !== '') {
      if (this.decodeToken.roles !== 'Admin') {
        this.router.navigate([this.path.home]);
        return;
      }
    } else {
      this.router.navigate([this.path.home]);
      return;
    }

    const url = this.baseUrl + 'api/crud';

    this.http.get<UserResponseViewModel>(url, this.httpOptions).subscribe(
      (result) => {
        this.listData = result.userList;
        if (result.refreshToken !== '') {
          sessionStorage.setItem('access_token', result.refreshToken);
          this.DecodeTokenFuntcion();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openComfirmModal(data: UserResponseModel) {
    const modalRef = this.modalService.open(MODALS['comfirmModal']);
    modalRef.componentInstance.item = data;
    modalRef.result.then(
      (result) => {
        const url = this.baseUrl + 'api/crud/DeleteProfile';
        const postData = new DeleteModel(data.userId);

        this.http
          .post<UserResponseViewModel>(url, postData, this.httpOptions)
          .subscribe(
            (result) => {
              this.listData = result.userList;
console.log('result',result);

              if (result.refreshToken !== '') {
                sessionStorage.setItem('access_token', result.refreshToken);
                this.DecodeTokenFuntcion();
              }
            },
            (error) => {
              console.error(error);
            }
          );
      },
      (reason) => {
        console.log('reason', reason);
      }
    );
  }

  openEditModal(data) {
    const modalRef = this.modalService.open(MODALS['editModal']);
    modalRef.componentInstance.item = data;
    modalRef.result.then(
      (result) => {
        const url = this.baseUrl + 'api/crud/UpdateProfile';

        const postData = new UpdateModel();
        postData.userId = result.get('userId').value;
        postData.userAccount = result.get('userAccount').value;
        postData.userPassword = result.get('userPassword').value;
        postData.userPasswordSalt = result.get('userPasswordSalt').value;
        postData.userPolicy = result.get('userPolicy').value;
        postData.createTime = result.get('createTime').value;
        postData.updateTime = result.get('updateTime').value;

        this.http
          .post<UserResponseViewModel>(url, postData, this.httpOptions)
          .subscribe(
            (result) => {
              this.listData = result.userList;

              if (result.refreshToken !== '') {
                sessionStorage.setItem('access_token', result.refreshToken);
                this.DecodeTokenFuntcion();
              }
            },
            (error) => {
              console.error(error);
            }
          );
      },
      (reason) => {
        console.log('reason', reason);
      }
    );
  }

  DecodeTokenFuntcion() {
    const token = sessionStorage.getItem('access_token');

    if (token !== undefined && token !== null) {
      this.decodeToken = this.jwtHelperService.decodeToken(token);
      if (this.decodeToken.roles !== 'Admin') {
        this.router.navigate([this.path.home]);
        return;
      }
    } else {
      this.router.navigate([this.path.home]);
      return;
    }
  }
}

@Component({
  selector: 'confirm-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">提示訊息</h4>
      <button
        type="button"
        class="close"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>
        <strong
          >Are you sure you want to delete
          <span class="text-primary">{{ item.userAccount }}</span>
          profile?</strong
        >
      </p>
      <p>
        All information associated to this user profile will be permanently
        deleted.
      </p>
      <p>
        <span class="text-danger">This operation can not be undone.</span>
      </p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-danger"
        ngbAutofocus
        (click)="modal.close('Ok click')"
      >
        OK
      </button>
    </div>
  `,
})
export class comfirmModal {
  @Input() item: UserResponseModel;

  constructor(public modal: NgbActiveModal) {}
}

@Component({
  selector: 'edit-modal',
  template: `<div class="modal-header">
      <h4 class="modal-title" id="modal-title">Edit</h4>
      <button
        type="button"
        class="close"
        aria-label="Close button"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form
      focusInvalidInput
      [formGroup]="Form"
      #NgForm="ngForm"
      #form
      (ngSubmit)="onSubmit()"
    >
      <div class="modal-body">
        <div>
          <div
            class="cross-validation"
            [class.cross-validation-error]="
              Form.errors?.identityRevealed && (Form.touched || Form.dirty)
            "
          >
            <div class="row">
              <div class="col-4">
                <strong>User Id :</strong>
              </div>
              <div class="col-auto">
                <input
                  type="text"
                  class="form-control"
                  formControlName="userId"
                  onfocus="this.select()"
                  required
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-4">
                <strong>User Account :</strong>
              </div>
              <div class="col-auto">
                <input
                  type="text"
                  class="form-control"
                  formControlName="userAccount"
                  onfocus="this.select()"
                  required
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-4">
                <strong>User Password :</strong>
              </div>
              <div class="col-auto">
                <input
                  type="password"
                  class="form-control"
                  formControlName="userPassword"
                  onfocus="this.select()"
                  required
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-4">
                <strong>User Policy :</strong>
              </div>
              <div class="col-auto">
                <input type="checkbox" formControlName="userPolicy" />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-4">
                <strong>Create Time :</strong>
              </div>
              <div class="col-auto">
                <input
                  type="text"
                  class="form-control"
                  formControlName="createTime"
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-4">
                <strong>Update Time :</strong>
              </div>
              <div class="col-auto">
                <input
                  type="text"
                  class="form-control"
                  formControlName="updateTime"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          (click)="modal.dismiss()"
        >
          Cancel
        </button>
        <button type="sumbit" ngbAutofocus class="btn btn-danger">Ok</button>
      </div>
    </form>`,
})
export class editModal implements OnInit {
  @Input() item: UserResponseModel;
  Form: FormGroup;

  constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      userId: [
        { value: this.item.userId, disabled: true },
        [Validators.required],
      ],
      userAccount: [
        { value: this.item.userAccount, disabled: true },
        Validators.required,
      ],
      userPassword: [
        { value: this.item.userPassword, disabled: true },
        Validators.required,
      ],
      userPasswordSalt: [this.item.userPasswordSalt],
      userPolicy: [this.item.userPolicy],
      createTime: [
        { value: this.item.createTime, disabled: true },
        Validators.required,
      ],
      updateTime: [
        { value: this.item.updateTime, disabled: true },
        Validators.required,
      ],
    });
  }

  onSubmit() {
    if (!this.Form.valid) {
      return;
    }
    this.modal.close(this.Form);
  }
}

const MODALS: { [name: string]: Type<any> } = {
  editModal: editModal,
  comfirmModal: comfirmModal,
};
