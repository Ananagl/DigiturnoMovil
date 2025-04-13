import { Component, OnInit } from '@angular/core';
import { TestService } from './Services/test.service';

@Component({
  selector: 'app-root',
  template: `<h1>{{ mensaje }}</h1>`,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mensaje = '';

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.testService.getSaludo().subscribe(data => {
      this.mensaje = data;
    });
  }
}