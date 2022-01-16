import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { InventoryService } from '../inventory.service';
import { ItemDialogueComponent } from 'app/components/item-dialogue/item-dialogue.component';
import { MaterialDialogueComponent } from 'app/components/material-dialogue/material-dialogue.component';
import { MatDialog } from '@angular/material/dialog';


export interface Ornament {
  code: string;
  name: string;
  vat: string;
  gross_weight: number;
  net_weight: number;
  price:number;
}

export interface Material {
  id:string,
  name:string,
  hsn:string,
  rate:number
}

@Component({
  selector: 'app-ornaments',
  templateUrl: './ornaments.component.html',
  styleUrls: ['./ornaments.component.scss']
})

export class OrnamentsComponent implements AfterViewInit {

  loading: boolean = true;
  displayedColumns: string[] = ['code','name', 'net_wt', 'gross_wt', 'vat'];
  displayedColumns2: string[] = ['code','name', 'net_wt', 'gross_wt', 'vat', 'price'];
  displayedColumns3: string[] = ['name','hsn', 'rate'];
  dataSource = new MatTableDataSource<Ornament>([]);
  dataSource2 = new MatTableDataSource<Ornament>([]);
  dataSource3 = new MatTableDataSource<Material>([]);
  constructor( private InvService: InventoryService, public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator | any;
  @ViewChild('paginator2') paginator2: MatPaginator | any;
  @ViewChild('paginator3') paginator3: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.fetchItemsAndDisp();
    this.fetchItemsSoldAndDisp();
    this.fetchMaterials();
  }

  fetchItemsAndDisp() {
    this.loading = true;
    this.InvService.getOrnamentsByStatus(0).subscribe((resp)=>{
      console.log("Response", resp);
      this.dataSource = new MatTableDataSource<Ornament>(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, err => {
      this.loading = false;
      console.log(err);
    })
  }

  fetchItemsSoldAndDisp() {
    this.loading = true;
    this.InvService.getOrnamentsByStatus(1).subscribe((resp)=>{
      console.log("Response", resp);
      this.dataSource2 = new MatTableDataSource<Ornament>(resp);
      this.dataSource2.paginator = this.paginator2;
      this.loading = false;
    }, err => {
      this.loading = false;
      console.log(err);
    })
  }

  fetchMaterials() {
    this.loading = true;
    this.InvService.getMaterials().subscribe((resp)=>{
      this.dataSource3 = new MatTableDataSource<Material>(resp);
      this.dataSource3.paginator = this.paginator3;
      this.loading = false;
    }, err =>{
      this.loading = false;
      console.log(err);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  addNew = () => {
    console.log("Openning Dialogue");
    const dialogRef = this.dialog.open(ItemDialogueComponent, {
      width: '70%',
      data: undefined,
    });

    dialogRef.afterClosed().subscribe(it => {
      console.log('The dialog was closed', it);
      if(it != undefined){
        let temp_obj:any = {
          name:it.pricing.name,
          gross_weight:it.pricing.gross_wt,
          net_weight:it.pricing.net_wt,
          vat:it.pricing.vat,
          material:it.pricing.material.id,
          code:(it.pricing.code.code) ? it.pricing.code.code: it.pricing.code,
          unit:it.pricing.unit,
          stone_price:it.pricing.stone_rate,
          price:it.pricing.amount,
          status:0
        };
        this.InvService.createOrn(temp_obj).subscribe((resp)=>{
          console.log("Added new Item", resp);
          this.fetchItemsAndDisp();
        })
      }
    });
  }

  updateMaterial = (material) => {
    console.log("Openning Dialogue");
    const dialogRef = this.dialog.open(MaterialDialogueComponent, {
      width: '50%',
      data: material,
    });

    dialogRef.afterClosed().subscribe(it => {
      console.log('The dialog was closed', it);
      if(it != undefined){
        let temp_obj:any = {
          name:it.material.name,
          hsn:it.material.hsn,
          rate:it.material.rate,
        };
        this.InvService.updateMaterial(it.id,temp_obj).subscribe((resp)=>{
          console.log("Updated Material", resp);
          this.fetchMaterials();
        })
      }
    });
  }

}
