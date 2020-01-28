import { Component, OnInit } from '@angular/core';
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { HttpClient } from "@angular/common/http";
import { Headers } from "@angular/http";
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  url: string = "http://lataniere.gainde2000.sn/";
  data;
  login_form: FormGroup;
  error_message: string;
  constructor(
    public nativeStorage: NativeStorage,
    public http: HttpClient,
    public Router: Router,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder
  ) {}

  getUser() {
    return this.nativeStorage.getItem("User");
  }
  setUser(user) {
    return this.nativeStorage.setItem("User", user);
  }
  logOut() {
    return this.nativeStorage.clear();
  }
  doLogin(username, password) {
    return this.http.post(this.url + "wp-json/jwt-auth/v1/token", {
      username: username,
      password: password
    });
  }
  doRegister(user_data, token) {
    return this.http.post(this.url + "users?token=" + token, user_data);
  }
  validateAuthToken(token) {
    let header: Headers = new Headers();
    header.append("Authorization", "Basic " + token);
    return this.http.post(
      this.url +
        "wp-json/jwt-auth/v1/token/validate?token=" +
        token,
      {},
      {}
    );
  }

  ionViewWillLoad() {
    this.login_form = this.formBuilder.group({
      username: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl("", Validators.required)
    });
  }

  async login(value, token) {
    let loading = await this.loadingCtrl.create();
    loading.present();

    this.url +
      "wp-json/jwt-auth/v1/token/validate?token=" +
      token.doLogin(value.username, value.password).subscribe(
        res => {
          this.url +
            "wp-json/jwt-auth/v1/token/validate?token=" +
            token.setUser({
              token: res.json().token,
              username: value.username,
              displayname: res.json().user_display_name,
              email: res.json().user_email
            });

          loading.dismiss();
          this.Router.navigateByUrl("/home");
        },
        err => {
          loading.dismiss();
          this.error_message = "Identifiant ou mot de passe invalide";
          console.log(err);
        }
      );
  }

  ngOnInit() {}
}
