import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm){
    const value = form.value;
    this.authService.login(value.email, value.password)
      .then()
  }

}
