import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

import Amplify, {Auth} from "aws-amplify";
import {MatToolbarModule} from "@angular/material/toolbar";
import { ProfileComponent } from './profile/profile.component';
import {AmplifyService} from "aws-amplify-angular";
import {MatGridListModule} from "@angular/material/grid-list";
import { BlogComponent } from './blog/blog.component';

Amplify.configure({
  Auth: {
    mandatorySignIn:true,
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_UhkP2HQpu',
    userPoolWebClientId: '6qrhdfu04k7rrdu33oj88r0nde',
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  API: {
    endpoints: [
      {
        name: "api719655d7",
        endpoint: "https://47nykg7rfc.execute-api.eu-central-1.amazonaws.com/dev"
      }
    ]
  }
})

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    ProfileComponent,
    BlogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatToolbarModule, MatGridListModule
  ],
  providers: [AmplifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
