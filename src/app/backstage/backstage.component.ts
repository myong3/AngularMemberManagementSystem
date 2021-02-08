import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { appPath } from '../app-path.const';
import { UserRepsonseModel } from './backstage.component.models';
@Component({
  selector: 'app-backstage',
  templateUrl: './backstage.component.html',
  styleUrls: ['./backstage.component.css'],
})
export class BackstageComponent implements OnInit {
  path = appPath;
  baseUrl = 'https://localhost:44329/';
  closeResult: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };
  listData: Array<UserRepsonseModel>;
  @ViewChild('form') formElementRef: ElementRef;

  constructor(
    private router: Router,
    private jwtHelperService: JwtHelperService,
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('access_token');

    if (token !== undefined && token !== null) {
      const decodeToken = this.jwtHelperService.decodeToken(token);

      if (decodeToken.roles !== 'Admin') {
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
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  open(name, data) {
    console.log('data', data);

    this.modalService.open(MODALS[name]).result.then(
      (result) => {
        console.log('result', result);

        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        console.log('reason', reason);

        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

@Component({
  selector: 'ngbd-modal-confirm',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Profile deletion</h4>
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
          <span class="text-primary">"John Doe"</span> profile?</strong
        >
      </p>
      <p>
        All information associated to this user profile will be permanently
        deleted.
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
        (click)="modal.close('Ok click')"
      >
        Save
      </button>
    </div>
  `,
})
export class NgbdModalConfirm {
  constructor(public modal: NgbActiveModal) {}
}

@Component({
  selector: 'ngbd-modal-confirm-autofocus',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Profile deletion</h4>
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
      <p>
        <strong
          >Are you sure you want to delete
          <span class="text-primary">"John Doe"</span> profile?</strong
        >
      </p>
      <p>
        All information associated to this user profile will be permanently
        deleted.
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
        ngbAutofocus
        class="btn btn-danger"
        (click)="modal.close('Ok click')"
      >
        Ok
      </button>
    </div>
  `,
})
export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
}

const MODALS: { [name: string]: Type<any> } = {
  focusFirst: NgbdModalConfirm,
  autofocus: NgbdModalConfirmAutofocus,
};
