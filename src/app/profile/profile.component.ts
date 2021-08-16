import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string | undefined;
  email: string | undefined;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {

  }

}
