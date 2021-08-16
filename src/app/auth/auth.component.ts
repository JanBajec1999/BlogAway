import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginBool: Boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  loginSwitch(){
    this.loginBool = !this.loginBool;
  }

  continueAsGuest(){
    this.router.navigate(['home']);
  }

}
