import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProfileComponent} from "./profile/profile.component";
import {AuthComponent} from "./auth/auth.component";
import {BlogComponent} from "./blog/blog.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {AddBlogComponent} from "./add-blog/add-blog.component";
import {EditBlogComponent} from "./edit-blog/edit-blog.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'auth', component: AuthComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'addBlog', component: AddBlogComponent, canActivate: [AuthGuardService]},
  { path: 'editBlog', component: EditBlogComponent, canActivate: [AuthGuardService]},
  { path: 'blog/:id/:id2', component: BlogComponent},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
