import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Comment} from "../classes/comment";
import {BlogsService} from "../services/blogs.service";
import {AuthService} from "../services/auth.service";
import {User} from "../classes/user";
import {v4 as uuidv4} from "uuid";
import {forEach} from "lodash";
import {Blog} from "../classes/blog";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input('inputComment') element: {comment: Comment, blog: Blog};
  @Output() update_son_ids = new EventEmitter<Comment>();
  panelOpenState = false;
  replyBool: Boolean = false;
  commentReply: string;
  currentUser: User | undefined;
  editBool: Boolean = false;
  editComment: string;
  upvoteBool: Boolean = false;
  downvoteBool: Boolean = false;

  constructor(public blogsService: BlogsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUser().then(data => {
      this.currentUser = data;
      if(this.currentUser.username == ""){
        this.currentUser = undefined;
      }else{
        for(let i = 0; i < this.element.comment.up_votes.length; i++){
          if(this.element.comment.up_votes[i] == this.currentUser.username) this.upvoteBool = true;
        }
        for(let i = 0; i < this.element.comment.down_votes.length; i++){
          if(this.element.comment.down_votes[i] == this.currentUser.username) this.downvoteBool = true;
        }
      }
    });
    this.editComment = this.element.comment.comment;
  }

  createComment(){
    if(this.currentUser != undefined){
      const SK = "C#" + uuidv4();
      if(this.element != undefined){
        this.blogsService.createComment(SK, this.element.comment.PK, this.commentReply, this.element.comment.SK.substring(2), this.currentUser);
        this.element.comment.son_ids.push(SK.substring(2));
        this.blogsService.updateComment(this.element.comment, this.currentUser);
        let x = new Comment(this.element.comment.PK, SK, this.commentReply, Date.now().toLocaleString(), this.currentUser.username, [], [], []);
        x.father_id = this.element.comment.SK.substring(2);
        this.element.comment.replies.push(x);
      }
    }

  }

  editCommentFun(){
    if(this.currentUser != undefined){
      this.element.comment.comment = this.editComment;
      this.blogsService.updateComment(this.element.comment, this.currentUser);
      this.editBool = false;
    }

  }

  deleteCommentFun(){
    if(this.currentUser != undefined){
      this.blogsService.deleteComment(this.element.comment.PK, this.element.comment.SK, this.currentUser).then(result => {
        if(result == 1) {
          this.update_son_ids.emit(this.element.comment);
        }
      });
    }

  }

  onDeleteCommentFun(comment: Comment){
    if(this.currentUser != undefined){
      for(let i = 0; i < this.element.comment.son_ids.length; i++){
        if(this.element.comment.son_ids[i] == comment.SK.substring(2)){
          this.element.comment.son_ids.splice(i, 1);
          this.blogsService.updateComment(this.element.comment, this.currentUser).then(data => {
            location.reload();
          });
        }
      }
    }

  }

  onDownVote(){
    if(this.currentUser != undefined){
      if(this.downvoteBool){
        this.downvoteBool = false;
        this.element.comment.down_votes.splice(this.element.comment.down_votes.indexOf(this.currentUser.username), 1);
        this.element.comment.votes++;
      }else{
        this.downvoteBool = true;
        this.element.comment.down_votes.push(this.currentUser.username);
        this.element.comment.votes--;
        if(this.upvoteBool){
          this.upvoteBool = false;
          this.element.comment.up_votes.splice(this.element.comment.up_votes.indexOf(this.currentUser.username), 1);
          this.element.comment.votes--;
        }
      }
      this.blogsService.updateComment(this.element.comment, this.currentUser);
    }

  }

  onUpVote(){
    if(this.currentUser != undefined){
      if(this.upvoteBool){
        this.upvoteBool = false;
        this.element.comment.up_votes.splice(this.element.comment.up_votes.indexOf(this.currentUser.username), 1);
        this.element.comment.votes--;
      }else{
        this.upvoteBool = true;
        this.element.comment.up_votes.push(this.currentUser.username);
        this.element.comment.votes++;
        if(this.downvoteBool){
          this.downvoteBool = false;
          this.element.comment.down_votes.splice(this.element.comment.down_votes.indexOf(this.currentUser.username), 1);
          this.element.comment.votes++;
        }
      }
      this.blogsService.updateComment(this.element.comment, this.currentUser);
    }
  }

}
