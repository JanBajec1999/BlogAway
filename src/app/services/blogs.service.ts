import { Injectable } from '@angular/core';
import { API } from 'aws-amplify';
import {Blog} from "../classes/blog";
import {Comment} from "../classes/comment";
import {User} from "../classes/user";
import {v4 as uuidv4} from 'uuid';
import {Router} from "@angular/router";
import {userInfo} from "os";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  constructor(public router: Router, public authService: AuthService) { }

  nameAPI = 'api719655d7';
  pathBlog = '/blogs';
  pathComment = '/comments';

  getBlogs(): Blog[]{
    //how to get date to string to save to dynamodb
    // const stringDate = Date.now();
    // console.log(stringDate);  //1629043946703
    // const newDate = new Date(stringDate);
    // console.log(newDate.toString()); //Sun Aug 15 2021 18:13:17 GMT+0200 (Central European Summer Time)
    const myInit = { // OPTIONAL
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {}
    };
    const blogArray: Blog[] = [];
    API.get(this.nameAPI, this.pathBlog, myInit).then(response => {
      for(let i = 0; i < response.data.length; i++){
        let ts = response.data[i].SK.substring(2);
        ts = Number(ts);
        const newDate = new Date(ts);
        blogArray.push(new Blog(response.data[i].PK, response.data[i].SK, response.data[i].title, response.data[i].content, response.data[i].img,newDate.toLocaleString(), response.data[i].username));
      }
    }).catch(error => {
      console.log(error.response);
    });
    return blogArray;
  }

  getBlogsByUser(user: User): Blog[]{
    const myInit = { // OPTIONAL
      headers: {
        Authorization: user.JWT
      }, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        username: user.username
      },
      body: {

      }
    };
    const blogArray: Blog[] = [];
    API.get(this.nameAPI, this.pathBlog + '/user', myInit).then(response => {
      for(let i = 0; i < response.data.length; i++){
        let ts = response.data[i].SK.substring(2);
        ts = Number(ts);
        const newDate = new Date(ts);
        blogArray.push(new Blog(response.data[i].PK, response.data[i].SK, response.data[i].title, response.data[i].content, response.data[i].img,newDate.toLocaleString(), response.data[i].username));
      }
    }).catch(error => {
      console.log(error.response);
    });
    return blogArray;
  }

  getBlogById(blogPK: string, blogSK: string): Promise<Blog>{
    const myInit = { // OPTIONAL
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        PK: blogPK,
        SK: blogSK
      }
    };
    return API.get(this.nameAPI, this.pathBlog + '/object', myInit).then(response => {
      let ts = response.data.SK.substring(2);
      ts = Number(ts);
      const newDate = new Date(ts);
      return new Blog(response.data.PK, response.data.SK, response.data.title, response.data.content, response.data.img, newDate.toLocaleString(), response.data.username);
    })
  }

  getCommentsOfBlogById(blogPK: string): Promise<Comment[]>{
    const myInit = { // OPTIONAL
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        PK: blogPK
      }
    };
    return API.get(this.nameAPI, this.pathComment, myInit).then(response => {
      const comments: Comment[] = [];
      const replies: Comment[] = [];
      for(let i = 0; i < response.data.Count; i++){
        let ts = response.data.Items[i].date;
        ts = Number(ts);
        const newDate = new Date(ts);
        const newComment = new Comment(response.data.Items[i].PK, response.data.Items[i].SK, response.data.Items[i].comment, newDate.toLocaleString(), response.data.Items[i].username, response.data.Items[i].son_ids, response.data.Items[i].up_votes, response.data.Items[i].down_votes);
        if(response.data.Items[i].up_votes != undefined) newComment.up_votes = response.data.Items[i].up_votes;
        if(response.data.Items[i].down_votes != undefined) newComment.down_votes = response.data.Items[i].down_votes;
        if(response.data.Items[i].father_id == undefined) comments.push(newComment);
        else{
          newComment.father_id = response.data.Items[i].father_id;
          replies.push(newComment);
        }
      }
      const comLen = comments.length;
      for(let i = 0; i < comLen; i++){
        if(comments[i].son_ids == []) continue;
        comments[i].replies = this.recursiveReplySearch(comments[i], replies);
      }
      return comments;
    })
  }

  recursiveReplySearch(comment: Comment, replies: Comment[]): Comment[]{
    const newReplies: Comment[] = [];
    for(let c = 0; c < comment.son_ids.length; c++){
      for(let r = 0; r < replies.length; r++){
        if(comment.son_ids[c] == replies[r].SK.substring(2)){
          newReplies.push(replies[r]);
          replies.splice(r, 1);
        }
      }
    }
    for(let i = 0; i < newReplies.length; i++){
      newReplies[i].replies = this.recursiveReplySearch(newReplies[i], replies);
    }
    return newReplies;
  }

  postBlog(title: string, content: string, img: string, user: User){
    const PK = uuidv4();
    const SK = "B#" + Date.now().toString();
    const myInit = {
      headers: {
        Authorization: user.JWT
      },
      response: true,
      body : {
        PK: PK,
        SK: SK,
        content: content,
        title: title,
        img: img,
        username: user.username
      }
    };
    API.put(this.nameAPI, this.pathBlog, myInit)
      .then(response => {
        this.router.navigate(['profile']);
      }).catch(error =>{
        console.log(error);
    })
  }

  deleteBlog(PK: string, SK: string, user: User): Promise<Number>{
    const myInit = { // OPTIONAL
      headers: {
        Authorization: user.JWT
      }, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        PK: PK,
        SK: SK,
      }
    };
    return API.del(this.nameAPI, this.pathBlog, myInit)
      .then(response => {
        this.router.navigate(['profile']);
        return 1;
      }).catch(error =>{
      console.log(error);
      return 2
    })
  }

  deleteComment(PK: string, SK: string, user: User): Promise<Number>{
    const myInit = { // OPTIONAL
      headers: {
        Authorization: user.JWT
      }, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        PK: PK,
        SK: SK,
      }
    };
    return API.del(this.nameAPI, this.pathComment, myInit)
      .then(response => {
        return 1;
      }).catch(error =>{
        console.log(error);
        return 2
      })
  }

  updateBlog(PK: string, SK: string, img: string, content: string, title: string, user: User): Promise<any>{
    const myInit = { // OPTIONAL
      headers: {
        Authorization: user.JWT
      }, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      body: {
        PK: PK,
        SK: SK,
        img: img,
        content: content,
        title: title,
        username: user.username
      }
    };
    return API.post(this.nameAPI, this.pathBlog, myInit)
      .then(response => {
        this.router.navigate(['profile']);
        return 1;
      }).catch(error =>{
        console.log(error);
        return 2
      })
  }

  createComment(SK_id: string, blogPK: string, comment: string, father_id: string, user: User){
    const PK = blogPK;
    const SK = SK_id;
    if(father_id == ''){
      const myInit = {
        headers: {
          Authorization: user.JWT
        },
        response: true,
        body : {
          PK: PK,
          SK: SK,
          comment: comment,
          date: Date.now().toString(),
          username: user.username,
          son_ids: [],
          up_votes: [],
          down_votes: []
        }
      };
      API.put(this.nameAPI, this.pathComment, myInit)
        .then(response => {
          console.log(response);
        }).catch(error =>{
        console.log(error);
      })
    }else{
      const myInit = {
        headers: {
          Authorization: user.JWT
        },
        response: true,
        body : {
          PK: PK,
          SK: SK,
          comment: comment,
          father_id: father_id,
          date: Date.now().toString(),
          username: user.username,
          son_ids: [],
          up_votes: [],
          down_votes: []
        }
      };
      API.put(this.nameAPI, this.pathComment, myInit)
        .then(response => {
          console.log(response);
        }).catch(error =>{
        console.log(error);
      })
    }
  }

  updateComment(comment: Comment, user: User): Promise<any>{
    const myInit = { // OPTIONAL
      headers: {
        Authorization: user.JWT
      }, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      body: {
        PK: comment.PK,
        SK: comment.SK,
        up_votes: comment.up_votes,
        father_id: comment.father_id,
        down_votes: comment.down_votes,
        son_ids: comment.son_ids,
        comment: comment.comment,
        username: comment.username
      }
    };
    return API.post(this.nameAPI, this.pathComment, myInit)
      .then(response => {
        return 1;
      }).catch(error =>{
        console.log(error);
        return 2
      })
  }

}
