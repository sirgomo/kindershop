import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EinkaufskorbService } from './einkaufskorb.service';
import { Observable, Subscription, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Location, provideCloudflareLoader } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { FormControl, FormGroup } from '@angular/forms';
import { iKorbItem } from '../model/iKorbItem';
import { IUser } from '../model/iUser';
import { PurchaseItem, loadScript } from '@paypal/paypal-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BESTELLUNGSTATUS, PAYART, iPaypalRes } from '../model/iPaypalRes';



@Component({
  selector: 'app-einkaufskorb',
  templateUrl: './einkaufskorb.component.html',
  styleUrls: ['./einkaufskorb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EinkaufskorbComponent implements AfterViewInit{

  @ViewChild('matStepper', {static: false}) matStepper!: MatStepper;
  totalPrice : number = 0;
  isLoaged$ = new Observable<any>;
  form: FormControl = new FormControl();
  anonim: boolean = true;
  adressForm!: FormGroup;
  userData = {};
  itemsInKorb : iKorbItem[] = new Array();
  itemsInKorb$ = this.korbServ.artikelsInKorb$.pipe(tap((res) => {
    this.itemsInKorb.splice(0, this.itemsInKorb.length);
    this.itemsInKorb = res;
    this.totalPrice = 0;
    for (let i = 0; i< res.length; i++) {
      this.totalPrice += Number(res[i].preis) * res[i].menge;
      this.totalPrice = Number(this.totalPrice.toFixed(2));
    }
  }));
  checkPrice$ = new Observable();
  columns: string[] = ['id', 'name', 'size', 'preis','meherSteuer', 'menge', 'delete'];

  constructor (private korbServ: EinkaufskorbService, private auth: AuthService, private matDialog: MatDialog,
    private locat: Location, private snackBar: MatSnackBar) {

    }


  ngAfterViewInit(): void {
    this.isLoaged$ = this.auth.isloged$.pipe(tap((res) => {
      if (res && this.anonim === true) {

        if(this.matStepper ) {
          if(this.matStepper.selected !== undefined)
            this.matStepper.selected.completed = true;

            this.matStepper.next();
            this.anonim = false;
        }
      }
    }));
  }
  ngOnInit(): void {

  }

  deleteElement(id: number) {
    this.korbServ.deleteItem(id);
  }
  plusItem(itemid: number) {
    this.korbServ.changeMenge(itemid, 1);
  }
  minusItem(itemid: number) {
    this.korbServ.changeMenge(itemid, -1);
  }
  login() {

  const dialogConfig : MatDialogConfig = new MatDialogConfig();
  dialogConfig.minHeight = '350px';
  dialogConfig.width = '400px';
  dialogConfig.data = this.locat.path();
  this.matDialog.open(LoginComponent, dialogConfig);
  }
  onChange(){
  this.matStepper.next();
  }
  addressForm(address: FormGroup) {

    this.adressForm = address;
   Object.assign(this.userData, this.adressForm.value)
   //check preises im server
   this.checkPrice$ = this.korbServ.checkBestellung(this.userData as IUser, this.itemsInKorb).pipe(
    tap((res) => {
      if(res.preis === undefined) {
        const err = new Error();
        Object.assign(err, res);
        this.snackBar.open(err.message, 'Ok', {duration: 3000})
        this.matStepper.previous();
        return
      }
      this.loadPaypal(res, this.adressForm, this.korbServ);
    })
   );
   this.matStepper.next();
  }
  async loadPaypal(item : {preis: string, item: iKorbItem[]}, userdata: FormGroup, serv: EinkaufskorbService) {
    let paypal;
    const pItems = await this.getItemsFurPaypal(item.item);
    const user = this.getUserAddresse(userdata);



    try {
      paypal = await loadScript({ "client-id" : 'AeDiupsu7C8EsJ1LlfTWZ5Hjqa_jBrL07wotcEaGIyH8Q7BgtlStuniAPw94dAi1482Jv_-xk0RpJAlU', "currency": 'EUR',
    });
    } catch (err) {
      console.log(err);
    }

    if(paypal !== undefined && paypal?.Buttons !== undefined) {
      try {

      await paypal.Buttons({
          createOrder(data, actions) {
              return actions.order.create({
                application_context: {
                  brand_name: 'Fischfang-Profi',
                  locale: 'de-DE',
                  shipping_preference: 'SET_PROVIDED_ADDRESS',
                },
                purchase_units: [{
                  amount: {
                    currency_code: 'EUR',
                    value: item.preis,
                    breakdown: {
                      item_total: { currency_code: 'EUR', value: pItems.total_items.toFixed(2)},
                      tax_total: { currency_code: 'EUR', value: pItems.total_tax.toFixed(2)}
                    }
                  },
                  items: pItems.items,
                  shipping: {
                    name: {
                      full_name: user.name
                    },
                    type: 'SHIPPING',
                    address: {
                      address_line_1 : user.strasse,
                      address_line_2 : user.hausnr,
                      postal_code: user.plz,
                      admin_area_2: user.city,
                      country_code: 'DE'
                    }
                  }
                }]
              })
          },
          onApprove(data, actions) {
            if(actions.order)
              return actions.order.capture().then((res) => {
                if(res.id !== null && res.status === 'COMPLETED') {
                const pay = <iPaypalRes>{};
                pay.payart = PAYART.PAYPAL;
                pay.bazahlt_am = new Date(Date.now());
                pay.artikels_list = JSON.stringify( item.item);
                pay.bestellung_status = BESTELLUNGSTATUS.INBEARBEITUNG;
                pay.einkaufs_datum = new Date(Date.now());
                pay.email = res.payer.email_address;
                pay.hausnummer = user.hausnr;
                if(userdata.get('shippingaddress')?.getRawValue() === true ) {
                  pay.l_nachname = userdata.get('l_nachname')?.getRawValue();
                  pay.l_strasse = userdata.get('l_strasse')?.getRawValue();
                  pay.l_hausnummer = userdata.get('l_hausnummer')?.getRawValue();
                  pay.l_plz = userdata.get('l_plz')?.getRawValue();
                  pay.l_stadt = userdata.get('l_stadt')?.getRawValue();
                }
                pay.nachname =  userdata.get('nachname')?.getRawValue();
                pay.vorname = userdata.get('vorname')?.getRawValue();
                pay.paypalOrderId = res.id;
                pay.plz = user.plz;
                pay.stadt = user.city;
                pay.steuer = Number(res.purchase_units[0].amount.breakdown?.tax_total?.value);
                pay.strasse = user.strasse;
                pay.total_price = Number(res.purchase_units[0].amount.breakdown?.item_total?.value);

               serv.createBestellugn(pay);


                }
              }, (err) => {
                console.log(err);
              })

              return new Promise(() => {});
          },
          onShippingChange(data, actions) {
             if(data.shipping_address?.country_code !== 'DE') {
              return actions.reject();
             }

             return actions.resolve();
          },
          style: {
            color: 'silver',
            shape: 'pill',
            layout: 'vertical'
          },
        }).render('#containerp')
    } catch (error) {
        console.error("failed to render the PayPal Buttons", error);
    }
  }
  }
  private getUserAddresse(userdata: FormGroup<any>) {
    const user = { name: '', strasse: '', hausnr: '', plz: '', city: '' };

    if(userdata.get('shippingaddress')?.getRawValue() === false ) {
      user.name = userdata.get('vorname')?.getRawValue() + ' ' + userdata.get('nachname')?.getRawValue();
      user.strasse = userdata.get('strasse')?.getRawValue();
      user.hausnr = userdata.get('hausnummer')?.getRawValue();
      user.plz = userdata.get('plz')?.getRawValue();
      user.city = userdata.get('stadt')?.getRawValue();
    } else {
      user.name = userdata.get('l_nachname')?.getRawValue();
      user.strasse = userdata.get('l_strasse')?.getRawValue();
      user.hausnr = userdata.get('l_hausnummer')?.getRawValue();
      user.plz = userdata.get('l_plz')?.getRawValue();
      user.city = userdata.get('l_stadt')?.getRawValue();
    }

    return user;
  }

  getMeherwehrSteuer(items: iKorbItem[]) {
    let mwst = 0;
    if (items.length < 1 ) return mwst;

    for (let i = 0; i < items.length; i++) {
      mwst += (items[i].preis * items[i].mwst / 100) * items[i].menge;
    }
    return mwst.toFixed(2);
  }
  getTotalPriceWithMwst() {
    return (this.totalPrice + Number(this.getMeherwehrSteuer(this.itemsInKorb))).toFixed(2);
  }

  private getItemsFurPaypal(items: iKorbItem[]): { items: PurchaseItem[], total_items: number, total_tax: number } {
    if(items === undefined) return { items: [], total_items: 0, total_tax: 0 };
    const pItems : PurchaseItem[] = new Array(items.length);
    let menge = 0;
    let tax = 0;
    for (let i = 0; i < items.length; i++) {
      const pItem : PurchaseItem = {
        name: items[i].name,
        quantity: items[i].menge.toString(),
        unit_amount: { currency_code: 'EUR', value: items[i].preis.toString() },
        category: 'PHYSICAL_GOODS',
        tax: { currency_code: 'EUR', value: (items[i].preis * items[i].mwst / 100).toFixed(2)},
      }
      pItems[i] = pItem;
      menge += items[i].preis * items[i].menge;
      if(items[i].mwst !== 0)
      tax += (items[i].preis * items[i].mwst / 100) * items[i].menge;
    }

    return {items: pItems, total_items: menge, total_tax: tax};
  }
}
