import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
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
  UserRepsonseModel,
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
  listData: Array<UserRepsonseModel>; // 會員資料

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

    this.http.get<Array<UserRepsonseModel>>(url, this.httpOptions).subscribe(
      (result) => {
        this.listData = result;
        if (result[0].refreshToken !== '') {
          sessionStorage.setItem('access_token', result[0].refreshToken);
          this.DecodeTokenFuntcion();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openComfirmModal(data: UserRepsonseModel) {
    const modalRef = this.modalService.open(MODALS['comfirmModal']);
    modalRef.componentInstance.item = data;
    modalRef.result.then(
      (result) => {
        const url = this.baseUrl + 'api/crud/DeleteProfile';
        const postData = new DeleteModel(data.userId);

        this.http
          .post<Array<UserRepsonseModel>>(url, postData, this.httpOptions)
          .subscribe(
            (result) => {
              this.listData = result;

              if (result[0].refreshToken !== '') {
                sessionStorage.setItem('access_token', result[0].refreshToken);
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
        console.log('result', result);
        const url = this.baseUrl + 'api/crud/UpdateProfile';
        const postData = new UpdateModel(result);

        this.http
          .post<Array<UserRepsonseModel>>(url, postData, this.httpOptions)
          .subscribe(
            (result) => {
              this.listData = result;

              if (result[0].refreshToken !== '') {
                sessionStorage.setItem('access_token', result[0].refreshToken);
                this.DecodeTokenFuntcion();
              }
            },
            (error) => {
              console.error(error);
            }
          );
      },
      (reason) => {
        const url = this.baseUrl + 'api/crud';

        this.http
          .get<Array<UserRepsonseModel>>(url, this.httpOptions)
          .subscribe(
            (result) => {
              this.listData = result;
              if (result[0].refreshToken !== '') {
                sessionStorage.setItem('access_token', result[0].refreshToken);
                this.DecodeTokenFuntcion();
              }
            },
            (error) => {
              console.log(error);
            }
          );
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
  @Input() item: UserRepsonseModel;

  constructor(public modal: NgbActiveModal) {}
}

@Component({
  selector: 'edit-modal',
  template: `
    <div class="modal-header">
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
    <div class="modal-body">
      <div>
        <div>
          <div class="row">
            <div class="col-4">
              <strong>User Id :</strong>
            </div>
            <div class="col-auto">
              <input
                type="text"
                class="form-control"
                [(ngModel)]="userData.userId"
                onfocus="this.select()"
                disabled="true"
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
                [(ngModel)]="userData.userAccount"
                onfocus="this.select()"
                disabled="true"
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
                [(ngModel)]="userData.userPassword"
                onfocus="this.select()"
                disabled="true"
                required
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-4">
              <strong>User Policy :</strong>
            </div>
            <div class="col-auto">
              <input type="checkbox" [(ngModel)]="userData.userPolicy" />
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
                [(ngModel)]="userData.createTime"
                disabled="true"
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
                [(ngModel)]="userData.updateTime"
                disabled="true"
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
      <button
        type="button"
        ngbAutofocus
        class="btn btn-danger"
        (click)="modal.close(item)"
      >
        Ok
      </button>
    </div>
  `,
})
export class editModal implements OnInit {
  @Input() item: UserRepsonseModel;

  userData: UserRepsonseModel;

  constructor(public modal: NgbActiveModal) {}
  ngOnInit(): void {
    this.userData = this.item;
  }
}

const MODALS: { [name: string]: Type<any> } = {
  editModal: editModal,
  comfirmModal: comfirmModal,
};
