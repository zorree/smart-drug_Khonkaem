import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import * as base64 from "byte-base64";
import { element } from 'protractor';

import { url } from 'src/assets/url/ex';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

username : any;
b64: any;
date:any;
drug:any;
position:any;
prepack:any;
qty:any;
hos_guid:any;
box_transaction:any;
json = [];
data_test:any = [];
box_input:any;
bs64:any;

  constructor(
    private router:Router,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController,
    private http:HttpClient,
    private alert:AlertController,
  

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


  async box_transactionToast_err() {
    const box_transactionToast_err = await this.toastController.create({
      message: "รหัสยืนยัน ไม่ตรงกัน",
      duration: 3000
    });
    box_transactionToast_err.present();
  }


  async box_transactionToast_undefined() {
    const box_transactionToast_undefined = await this.toastController.create({
      message: "ไม่พบ รหัสยืนยัน ",
      duration: 3000
    });
    box_transactionToast_undefined.present();
  }


  async empty_Data_Toast(){
    const empty_Data_Toast = await this.toastController.create({
      message  : "ไม่พบข้อมูล" ,
      duration : 2000 
    })
    empty_Data_Toast.present();

  }

  async success_Toast(){
    const success_Toast = await this.toastController.create({
      message  : "สำเร็จ" ,
      duration : 2000
    })
    success_Toast.present();
  }

  async presentAlertConfirm_exit() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'ยืนยัน',
      message: 'ต้องการออกจากแอพ',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ตกลง',
          handler: () => {
            console.log('Confirm Okay');
            navigator['app'].exitApp();
            this.storage.set('username', null); 
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirm_add_drug(i:any) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'ยืนยัน',
      message: 'ยืนยัน การเติมยา',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ยืนยัน',
          handler: () => {
            console.log('Confirm Okay');
           this.add_drug(i);
          }
        }
      ]
    });

    await alert.present();
  }



 async ngOnInit() {
    const today = new Date();
    this.date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

     this.username = await this.storage.get('username');
     this.hos_guid = await this.storage.get('hos_guid');
     console.log(this.hos_guid);

   
  }


  // _test_transaction(){
  //   let hos_guid ={ hos_guid:'{B4C76E1B-EF36-4DDF-BCE6-85D106948BE2}'};
  //   console.log( hos_guid);
  //   this.http.post<any>('http://localhost:3000/api/scan_drug',hos_guid).subscribe(data => {
  //    if (data) {
  //      console.log(data);
  //     for(let res of data){
  //       if(res.drug_image === null){
  //         this.json.push({
  //           date: res.transaction_date.slice(0, 10),
  //           drug : res.genericname,
  //           prepack : res.prepack,
  //           qty : res.qty,
  //           position : res.boxserial,
  //           b64 : null,
  //           box_transaction : res.box_transaction,
  //           prepare_agent: res.prepare_agent,
  //           hos_guid : res.hos_guid
  //           });
  //       }else{
  //          this.json.push({
  //         date: res.transaction_date.slice(0, 10),
  //         drug : res.genericname,
  //         prepack : res.prepack,
  //         qty : res.qty,
  //         position : res.boxserial,
  //         b64 : base64.bytesToBase64(res.drug_image.data),
  //         box_transaction : res.box_transaction,
  //         prepare_agent: res.prepare_agent,
  //         hos_guid : res.hos_guid
  //         });
  //       }
  //       }  
  //       }
  //  })
  // }
  
  option_add_drug(p:any,i:any){
    console.log(p);
    console.log(i);
  
    let json={
        position:p,
        box_transaction:i
    }

  this.http.post<any>(url+'api/option_add_drug',json).subscribe(data => {
    if (data) {
      console.log(data);
      
    }
  })
  }


 __scan_add_drug(){
     
  this.barcodeScanner.scan().then(barcodeData => {
      console.log(barcodeData);
      let hos_guid = {hos_guid : barcodeData["text"]};
     this.http.post<any>(url+'api/scan_drug',hos_guid).subscribe(data => {
      if (data) {
        for(let res of data){
          if(res.drug_image === null){
            this.json.push({
              date: res.transaction_date.slice(0, 10),
              drug : res.genericname,
              prepack : res.prepack,
              qty : res.qty,
              position : res.boxserial,
              b64 : null,
              box_transaction : res.box_transaction,
              prepare_agent: res.prepare_agent,
              hos_guid : res.hos_guid
              });
          }else{
             this.json.push({
            date: res.transaction_date.slice(0, 10),
            drug : res.genericname,
            prepack : res.prepack,
            qty : res.qty,
            position : res.boxserial,
            b64 : base64.bytesToBase64(res.drug_image.data),
            box_transaction : res.box_transaction,
            prepare_agent: res.prepare_agent,
            hos_guid : res.hos_guid
            });
          }
         
          } 
         this.qrcodetToast(barcodeData["text"]); 
      }else{
          this.empty_Data_Toast();
      } 
    })
   }).catch(err => {
       console.log('Error', err);
       this.qrcodetToast_err(err);
   });
}


__scan_Confirm(i:any){
  this.barcodeScanner.scan().then(barcodeData => {
    let code =barcodeData["text"];
    if(code.length == 7){
      console.log(code.slice(0,3));
      this.box_input = barcodeData["text"].slice(0,3);
      this.__add_Confirm(i);
    }else{
      console.log(code.slice(0,2));
      this.box_input = barcodeData["text"].slice(0,2);
      this.__add_Confirm(i);
    }
   }).catch(err => {
       console.log('Error', err);
       this.qrcodetToast_err(err);
   });
}



__add_Confirm(i:any){
  console.log(this.json[i].box_transaction);
  console.log(this.box_input);
  
  if(this.box_input === undefined){
    console.log('box_transactionToast_undefined');
    this.box_transactionToast_undefined();
  }else if(this.box_input === this.json[i].box_transaction){
  console.log(i)
  console.log(this.json[i].box_transaction);
  console.log(this.box_input);
  this.presentAlertConfirm_add_drug(i);
  }else{
    this.box_transactionToast_err();
  }

}

add_drug(i:any){
  let str ={
    last_fill :this.json[i].qty,
    remain : this.json[i].qty,
    hos_guid : this.json[i].hos_guid,
    box_transaction: this.json[i].box_transaction,
    position:  this.json[i].position,
    agent: this.username
  };
  console.log(str);
  
  this.http.post<any>(url+'api/add_drug',str).subscribe(res => {
    if (res["status"] === 200) {
      console.log(res["message"]); 
      this.success_Toast();
      this.__cancel_add();
    }else{
        this.empty_Data_Toast();
    } 
  })
}

__cancel_add(){
 this.json = [];
} 



__exitApp(){
  this.presentAlertConfirm_exit();
}

}


