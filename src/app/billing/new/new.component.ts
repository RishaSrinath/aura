import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemDialogueComponent } from 'app/components/item-dialogue/item-dialogue.component';
import { ItemData, billItem } from 'app/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';


pdfMake.vfs = pdfFonts.pdfMake.vfs; 
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  public billForm: FormGroup;
  Items: billItem[] = [];
  total: number = 0;
  loading:boolean = false;
  tax: any[] = [{tax:3, split:[{name:"SGST", rate:1.5}, {name:"CGST", rate:1.5}]}];
  selected_tax:any = this.tax[0];
  tax_amount: number[] = [0,0];

  payment_type:string = "Cash";
  date: string = "";

  constructor(public dialog: MatDialog, public billService: BillingService, private router: Router) {
    let shop_details:any = JSON.parse(sessionStorage.getItem('user_details'));
    let inv_number = "AB1";
    if(shop_details[0].shop.last_invoice.length > 0){
      inv_number = this.getInvoiceNumber(shop_details[0].shop.last_invoice[0]);
      console.log(inv_number);
      this.initialiseForm(inv_number);
    }
    else{
      this.initialiseForm(inv_number);
    } 
  }

  ngOnInit(): void {
  }

  removeItem = (itemIndex) =>{
    this.Items.splice(itemIndex, 1);
  }
  addNew = () => {
    console.log("Openning Dialogue");
    const dialogRef = this.dialog.open(ItemDialogueComponent, {
      width: '70%',
      data: undefined,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result != undefined){
        this.Items.push(result);
        this.calculateBill();
      }
    });
  }


  editItem = (itemIndex) =>{
    console.log("Editing Item", itemIndex);
    const dialogRef = this.dialog.open(ItemDialogueComponent, {
      width: '70%',
      data: this.Items[itemIndex],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result != undefined){
        this.Items[itemIndex] = result;
        this.calculateBill();
      }
    });
  }

  SavePDF = async() => { 
    if(this.Items.length > 0 && this.billForm.valid){
      this.loading = true;
      let item_list = [];
      let it:any;
      for(it of this.Items){
        let temp_obj:any = {
          name:it.pricing.name,
          gross_weight:it.pricing.gross_wt,
          net_weight:it.pricing.net_wt,
          vat:it.pricing.vat,
          material:it.pricing.material.id,
          code:it.pricing.code.code,
          unit:it.pricing.unit,
          stone_price:it.pricing.stone_rate,
          price:it.pricing.amount
        };
        if(it.item !== undefined){
          temp_obj.id = it.item.id;
        }
        item_list.push(temp_obj);
      };
      let customer_dtls = {
        first_name:this.billForm.value.billing_fname,
        last_name:this.billForm.value.billing_lname,
        mobile:this.billForm.value.billing_mobile,
        address:this.billForm.value.billing_address,
        postal_code:this.billForm.value.billing_post,
        city:this.billForm.value.billing_city,
      };
      let bill_dtls = {
        number:this.billForm.value.billing_number,
        tax:this.selected_tax.tax,
        amount:this.total,
        discount:0,
        status:1,
        total_installments:1,
        paid_installments:1,
        type:1,
        date:this.billForm.value.bill_date
      };
      // this.getPDFContent().then((docDefinition)=>{
      //   pdfMake.createPdf(docDefinition).open();
      // });
      this.billService.generateInvoice({items:item_list, customer:customer_dtls, bill:bill_dtls}).subscribe((resp1)=>{
        let shop_details:any = JSON.parse(sessionStorage.getItem('user_details'));
        if(shop_details[0].shop.last_invoice.length > 0){
          shop_details[0].shop.last_invoice[0] = bill_dtls.number;
          sessionStorage.setItem('user_details', JSON.stringify(shop_details));
        }
        this.loading = false;
        this.getPDFContent().then((docDefinition)=>{
          pdfMake.createPdf(docDefinition).open();
          this.router.navigate(['billing']);
        });
      }, err =>{
        console.log("Error creating invoice");
        this.loading = false;
      });
    }
  }

  getPDFContent = async() =>{
    return new Promise((res, rej)=>{
      let docDefinition = { 
        content: [ 
          {  
            text: 'AURAA SHOP',  
            fontSize: 16,  
            alignment: 'center',  
            color: '#047886'  
          },  
          {  
            text: 'INVOICE',  
            fontSize: 20,  
            bold: true,  
            alignment: 'center',  
            decoration: 'underline',  
            color: 'skyblue'  
          },
          {  
            text: 'Customer Details',  
            style: 'sectionHeader'  
          },
          {  
            columns: [  
                [  
                    {  
                        text: this.billForm.value.billing_fname,  
                        bold: true  
                    },  
                    { text: this.billForm.value.billing_mobile, },  
                    { text: this.billForm.value.billing_address, },  
                    { text: this.billForm.value.billing_city, },
                    { text: this.billForm.value.billing_post, }  
                ],  
                [  
                    {  
                    text: `Date: ${this.billForm.value.bill_date.toLocaleString()}`,  
                    alignment: 'right'  
                    },
                    // {  
                    //     text: `Date: ${new Date().toLocaleString()}`,  
                    //     alignment: 'right'  
                    // },  
                    {  
                        text: `Bill No : ${this.billForm.value.billing_number}`,  
                        alignment: 'right'  
                    }  
                ]  
            ]  
        },
        {  
          text: 'Purchase Details',  
          style: 'sectionHeader'  
        },  
        {  
            table: {  
                headerRows: 1,  
                widths: ['*', 'auto', 'auto', 'auto', 'auto'],  
                body: [  
                    ['Product', 'Net_wt', 'Gross_wt',"VAT", 'Amount'],
                    ...this.Items.map(p => ([p.pricing.name, p.pricing.net_wt, p.pricing.gross_wt,p.pricing.vat, p.pricing.amount.toFixed(2)])),
                    ...this.selected_tax.split.map((t,i)=>([{ text: `${t.name} (${t.rate} %)`, colSpan: 4 }, {}, {}, {}, this.tax_amount[i]])),
                    // [{ text: 'SGST', colSpan: 4 }, {}, {}, {}, 100],
                    // [{ text: 'CGST', colSpan: 4 }, {}, {}, {}, 100],
                    [{ text: 'Total Amount', colSpan: 4 }, {}, {},{}, this.total]  
                ]  
            }  
        }  
        ],
        styles: {  
            sectionHeader: {  
                bold: true,  
                decoration: 'underline',  
                fontSize: 14,  
                margin: [0, 15, 0, 15]  
            }  
        }
      }; 
      res(docDefinition);
    })
  }


  getInvoiceNumber = (last_number) =>{
    let number_str = '';
    let new_str = '';
    let zero_pad = '';
    for(let j = last_number.length - 1; j >= 0; j-- ){
        let num = Number(last_number[j]);
        if(num || (num == 0)){
            number_str = last_number[j] + number_str;
            zero_pad = zero_pad + '0';
        }
        else{
            new_str = last_number.slice(0, j+1);
            break;
        }
    }
    let new_number = (Number(number_str) + 1).toString();
    if(zero_pad.length > new_number.length){
        new_number = (zero_pad + new_number).slice(0-zero_pad.length);
    }
    return new_str+new_number;
  }

  initialiseForm = (inv) =>{
    this.billForm = new FormGroup({
      billing_number:new FormControl(inv, [Validators.required]),
      billing_fname:new FormControl( '', [Validators.required]),
      billing_lname:new FormControl( '', [Validators.required]),
      billing_mobile:new FormControl( '', [Validators.required]),
      billing_address:new FormControl( '', [Validators.required]),
      billing_city:new FormControl( '', [Validators.required]),
      billing_country:new FormControl( '', [Validators.required]),
      billing_post:new FormControl( '', [Validators.required]),
      bill_date:new FormControl(new Date()),
    });
  }

  calculateBill = () =>{
    let amount = 0;
    for(let it of this.Items){
      amount = amount + it.pricing.amount;
    }
    console.log("Item total", amount);
    let tax_amount = 0;
    this.tax_amount = [];
    for(let spl of this.selected_tax.split){
      tax_amount = tax_amount + Number((amount * (spl.rate / 100)).toFixed(2));
      this.tax_amount.push(Number((amount * (spl.rate / 100)).toFixed(2)));
    }
    console.log("Tax amount",tax_amount);
    this.total = amount + tax_amount;
  }

}
