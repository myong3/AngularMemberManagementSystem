import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  baseUrl = 'https://localhost:44329/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  click() {
    const url = this.baseUrl + 'api/login';

    this.http.get<Array<string>>(url, this.httpOptions).subscribe(
      (result) => {
        console.log('result', result);
      },
      (error) => {
        console.error('error', error);
      }
    );
  }
}
