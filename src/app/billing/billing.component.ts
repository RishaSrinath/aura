import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { BillingService } from './billing.service';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts"; 

pdfMake.vfs = pdfFonts.pdfMake.vfs; 

export interface BillElement {
  number: string;
  date: any;
  items: any;
  amount: number;
  customer: any;
  tax:any;
}



@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})

export class BillingComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['invoice','date', 'name', 'items', 'total'];
  dataSource = new MatTableDataSource<BillElement>([]);
  loading:boolean = true;
  shop:any;

  constructor(private router: Router, private billService:BillingService) {
    let shop_details:any = JSON.parse(sessionStorage.getItem('user_details'));
    this.shop = shop_details[0].shop;
  }

  ngAfterViewInit() {
    this.billService.getInvoices().subscribe( (resp) =>{
      this.dataSource = new MatTableDataSource<BillElement>(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, err =>{
      console.log("Error fetching invoices");
      this.loading = false;
    });
  }
  newBill () {
    this.router.navigate(['billing/new']);
  }

  viewBill(inv){
    console.log("Viewing Bill", inv);
    this.getPDFContent(inv).then((docDefinition)=>{
      pdfMake.createPdf(docDefinition).open();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPDFContent = async(invoice_details) =>{
    return new Promise((res, rej)=>{
      let selected_tax = [{name:"CGST", rate:invoice_details.tax/2}, {name:"SGST", rate:invoice_details.tax/2}];
      let total_amount = 0;
      invoice_details.items.map((p)=>{
        total_amount = total_amount + p.price;
      });
      let tax_amount = [((total_amount * (invoice_details.tax)/100)/2).toFixed(2), ((total_amount * (invoice_details.tax)/100)/2).toFixed(2)];
      let docDefinition = { 
        content: [ 
          {  
            text: this.shop.name,  
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
            text: `GST : ${this.shop.gst}`,
            alignment: 'left'  
          },
          {  
            text: 'Customer Details',  
            style: 'sectionHeader'  
          },
          {  
            columns: [  
                [  
                    {  
                        text: invoice_details.customer.first_name,  
                        bold: true  
                    },  
                    { text: invoice_details.customer.mobile, },  
                    { text: invoice_details.customer.address, },  
                    { text: invoice_details.customer.city, },
                    { text: invoice_details.customer.postal_code, }  
                ],  
                [  
                    {  
                    text: `Date: ${new Date(invoice_details.date).toLocaleString()}`,  
                    alignment: 'right'  
                    },
                    // {  
                    //     text: `Date: ${new Date().toLocaleString()}`,  
                    //     alignment: 'right'  
                    // },  
                    {  
                        text: `Bill No : ${invoice_details.number}`,  
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
                    ...invoice_details.items.map(p => ([p.name, p.net_weight, p.gross_weight,p.vat+" %", p.price.toFixed(2)])),
                    ...selected_tax.map((t,i)=>([{ text: `${t.name} (${t.rate} %)`, colSpan: 4 }, {}, {}, {}, tax_amount[i]])),
                    // [{ text: 'SGST', colSpan: 4 }, {}, {}, {}, 100],
                    // [{ text: 'CGST', colSpan: 4 }, {}, {}, {}, 100],
                    [{ text: 'Total Amount', colSpan: 4 }, {}, {},{}, invoice_details.amount]  
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



}
