import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { url } from 'src/assets/url/ex';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private username: any;
  private password: any;
  private res_login: any;

  constructor(
    private router: Router,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController,
    private http: HttpClient,

  ) {
    this.init();

  }
  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }


  async qrcodetToast(qrcode) {
    const qrcodetToast = await this.toastController.create({
      message: qrcode,
      duration: 2000
    });
    qrcodetToast.present();
  }
  async qrcodetToast_err(qrcode) {
    const qrcodetToast_err = await this.toastController.create({
      message: qrcode,
      duration: 2000
    });
    qrcodetToast_err.present();
  }


  async usernameToast(username) {
    const user = await this.toastController.create({
      message: username,
      duration: 5000
    })
    user.present();
  }

  async username_err_Toast() {
    const user = await this.toastController.create({
      message: "error 400",
      duration: 5000
    })
    user.present();
  }

  ngOnInit() {
    console.log(url)

  }

  async __login() {

    let data = { "username": this.username, "password": this.password };
    this.http.post<any>(url+'api/usernamelogin', data).subscribe(res => {
      console.log(res["message"]);
      if (res["status"] === 200) {
        this.res_login = res;
        this.router.navigate(['/home']);
        this.usernameToast(res["username"]);
        this.storage.set('username', res["username"]);
        this.storage.set('hos_guid', res["hos_guid"]);

      } else {
        this.res_login = null;
        this.username_err_Toast();
      }
      console.log(this.res_login);
    })


    // this.http.get('http://localhost:3000/api/login').subscribe((message) => {
    //   console.log(message); 
    //   if (message["msg"] === "empty") {
    //           this.res_login = null;
    //           }else{
    //           this.res_login = message;
    //           }
    //  })

  }

  async __login_with_qr() {


    this.barcodeScanner.scan().then(barcodeData => {
      let data = { "qrcode_id": barcodeData["text"] };
      // let data ={"qrcode_id": "P0006"};
      this.http.post<any>(url+'api/qrcodelogin', data).subscribe(res => {
        console.log(res["message"]);
        if (res["status"] === 200) {
          this.res_login = res;
          this.router.navigate(['/home']);
          this.usernameToast(res["username"]);
          this.storage.set('username', res["username"]);
          this.storage.set('hos_guid', res["hos_guid"]);

        } else {
          this.res_login = null;
          this.username_err_Toast();
        }
        console.log(this.res_login);
      })

    }).catch(err => {
      console.log('Error', err);
      this.qrcodetToast_err(err);
    });
  }


}
