import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../classes/user";
import * as _ from 'lodash';
import {Blog} from "../classes/blog";
import {BlogsService} from "../services/blogs.service";
import {result} from "lodash";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User;
  blogs: Blog[];

  constructor(public authService: AuthService, public blogsService: BlogsService, public router: Router) { }

  ngOnInit(): void {
    this.authService.getUser().then(data => {
      this.currentUser = data;
      this.blogs = this.blogsService.getBlogsByUser(this.currentUser);
    });
  }

  signOut(){
    this.authService.signOut();
  }

  delete(blog: Blog){
    this.blogsService.deleteBlog(blog.PK,blog.SK, blog.username, this.currentUser).then(result => {
      if(result == 1) {
        this.blogs.splice(this.blogs.indexOf(blog), 1);
      }
    });
  }

  edit(blog:Blog){
    this.router.navigate(['editBlog', blog]);
  }

  onBlogClick(blogPK: string, blogSK: string){
    this.router.navigate(['blog', blogPK, blogSK]);
  }
}
