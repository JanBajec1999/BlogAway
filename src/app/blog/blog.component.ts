import { Component, OnInit } from '@angular/core';
import {Blog} from "../classes/blog";
import {BlogsService} from "../services/blogs.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blog: Blog | undefined;

  constructor(private blogsService: BlogsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogsService.getBlogById(params['id'], params['id2']).then(response => {
        this.blog = response;
      });
    });
  }

}
