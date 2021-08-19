import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Blog} from "../classes/blog";
import {User} from "../classes/user";
import {BlogsService} from "../services/blogs.service";
import {AuthService} from "../services/auth.service";
import * as _ from "lodash";

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  blog: Blog;

  currentUser: User;
  imageError: string | null;
  isImageSaved: boolean;
  cardImageBase64: null | string;
  title: string | null = '';
  content: string | null = '';

  PK: string | null;
  SK: string | null;
  username: string | null;

  constructor(public route: ActivatedRoute, public blogsService: BlogsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUser().then(data => {
      this.currentUser = data;
    });
    this.PK = this.route.snapshot.paramMap.get('PK');
    this.SK = this.route.snapshot.paramMap.get('SK');
    this.cardImageBase64 = this.route.snapshot.paramMap.get('img');
    if(this.route.snapshot.paramMap.get('img')){
      this.isImageSaved = true;
    }
    this.content = this.route.snapshot.paramMap.get('content');
    this.title = this.route.snapshot.paramMap.get('title')
    this.username = this.route.snapshot.paramMap.get('username')
  }

  handleUpload(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 200000;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'kb';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path.substring(23);
          this.isImageSaved = true;
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return true;
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  editBlog(){
    if(this.cardImageBase64 != null && this.PK != null && this.SK != null && this.content != null && this.title != null){
      this.blogsService.updateBlog(this.PK, this.SK, this.cardImageBase64, this.content, this.title, this.currentUser);
    }else{

    }
  }

}
