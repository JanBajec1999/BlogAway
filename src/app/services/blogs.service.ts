import { Injectable } from '@angular/core';
import { API } from 'aws-amplify';
import {Blog} from "../classes/blog";

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  constructor() { }

  nameAPI = 'api719655d7';
  path = '/blogs';

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
    API.get(this.nameAPI, this.path, myInit).then(response => {
      for(let i = 0; i < response.data.length; i++){
        let ts = response.data[i].SK.substring(2);
        ts = Number(ts);
        const newDate = new Date(ts);
        blogArray.push(new Blog(response.data[i].PK, response.data[i].SK, response.data[i].title, response.data[i].content, response.data[i].img,newDate.toLocaleString()));
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
    return API.get(this.nameAPI, this.path + '/object', myInit).then(response => {
      let ts = response.data.SK.substring(2);
      ts = Number(ts);
      const newDate = new Date(ts);
      return new Blog(response.data.PK, response.data.SK, response.data.title, response.data.content, response.data.img, newDate.toLocaleString());
    })
  }

}
