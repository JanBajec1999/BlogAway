import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import {BlogsService} from "../services/blogs.service";
import {User} from "../classes/user";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {

  currentUser: User;
  imageError: string | null;
  isImageSaved: boolean;
  cardImageBase64: null | string;
  title: string = '';
  content: string = '';

  constructor(public blogsService: BlogsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUser().then(data => {
      this.currentUser = data;
    });
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
          // const imgBase64Path = e.target.result;
          // console.log(imgBase64Path);
          this.cardImageBase64 = e.target.result;
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

  postBlog(){
    if(this.cardImageBase64 != null){
      this.blogsService.postBlog(this.title, this.content, this.cardImageBase64, this.currentUser);
    }else{

    }
  }
}
