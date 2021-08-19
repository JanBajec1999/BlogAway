import { Component, OnInit } from '@angular/core';
import {Blog} from "../classes/blog";
import {Comment} from "../classes/comment";
import {BlogsService} from "../services/blogs.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {User} from "../classes/user";
import {AuthService} from "../services/auth.service";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blog: Blog | undefined;
  comments: Comment[] | undefined;
  comment: string;
  currentUser: User;

  constructor(private blogsService: BlogsService, private route: ActivatedRoute, public authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogsService.getBlogById(params['id'], params['id2']).then(response => {
        this.blog = response;
      });
      this.blogsService.getCommentsOfBlogById(params['id']).then(response => {
        this.comments = response;
      });
    });
    this.authService.getUser().then(data => {
      this.currentUser = data;
    });
  }

  createComment(){
    if(this.blog != undefined){
      const SK = "C#" + uuidv4();
      this.blogsService.createComment(SK, this.blog.PK, this.comment, '', this.currentUser);
      this.comments?.push(new Comment(this.blog.PK, SK, this.comment, Date.now().toLocaleString(), this.currentUser.username, [], [], []))
    }
  }

  onDeleteCommentFun(comment: Comment){
    if(this.comments != undefined)
    for(let i = 0; i < this.comments?.length; i++){
      if(this.comments[i].SK == comment.SK){
        this.comments.splice(i,1);
      }
    }
  }

}
