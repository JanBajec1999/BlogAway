import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string | undefined;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {

  }

  onHome(){
    this.router.navigate(['home'])
  }

  onProfile(){
    if(this.authService.signedIn){
      this.router.navigate(['profile'])
    }else{
      this.router.navigate(['auth'])
    }
  }

  onAddBlog(){
    if(this.authService.signedIn){
      this.router.navigate(['addBlog'])
    }else{
      this.router.navigate(['auth'])
    }
  }

}
