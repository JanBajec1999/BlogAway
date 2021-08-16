import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormControl, NgForm} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide = true;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onRegister(form: NgForm){
    const value = form.value;
    this.authService.register(value.username, value.email, value.password);
  }

}
