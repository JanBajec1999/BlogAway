import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {BlogsService} from "../services/blogs.service";
import {Blog} from "../classes/blog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  blogs: Blog[] = [];

  constructor(public authService: AuthService, public blogsService: BlogsService, private router: Router) { }

  ngOnInit(): void {
    this.blogs = this.blogsService.getBlogs();
  }

  signOut(){
    this.authService.signOut();
  }

  getBlogs() {
    this.blogs = this.blogsService.getBlogs();
  }

  onBlogClick(blogPK: string, blogSK: string){
    this.router.navigate(['blog', blogPK, blogSK]);
  }
}
