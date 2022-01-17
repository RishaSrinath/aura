import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemData } from 'app/interfaces';
import { Material, Ornament } from 'app/interfaces';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ComponentService } from '../component.service';

@Component({
  selector: 'app-item-dialogue',
  templateUrl: './item-dialogue.component.html',
  styleUrls: ['./item-dialogue.component.scss']
})
export class ItemDialogueComponent {
  materials: Material[] = [
    // {name:"Gold", hsn: "1", rate:4900},
    // {name:"Silver", hsn: "2", rate:4900},
    // {name:"Copper", hsn: "3", rate:4900},
  ];
  selectedMaterial : any;
  vat_amount: number;
  price: number;
  stone_price: number;
  amount: number;
  index: number = 0;
  ornmanent: Ornament = undefined;
  public itemForm: FormGroup;
  dummyItem: ItemData = {
    name:'',
    hsn:'',
    id:'',
    discount:{
      percentage:0,
      amount:0
    },
    tax:{
      percentage:0,
      amount:0
    },
    unit:"",
    price:"",
    quantity:0,
    amount:10000
  }

  dummyItemList: Ornament[] = [];



  filteredOptions: Observable<Ornament[]>;


  constructor(public dialogRef: MatDialogRef<ItemDialogueComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, public componentService : ComponentService) {

    if(data){
      this.index = data.index;
      this.ornmanent = data.item;
    }

    this.itemForm = new FormGroup({
      name:new FormControl( data ? data.pricing.name: '', [Validators.required]),
      material:new FormControl(data ? data.pricing.material: '', [Validators.required]),
      code:new FormControl(data ? data.pricing.code: '', [Validators.required]),
      vat:new FormControl(data ? data.pricing.vat: '', [Validators.required]),
      unit:new FormControl(data ? data.pricing.unit: '', [Validators.required]),
      price:new FormControl(data ? data.pricing.price: '', [Validators.required]),
      gross_wt:new FormControl(data ? data.pricing.gross_wt: '', [Validators.required]),
      net_wt: new FormControl(data ? data.pricing.net_wt: '',[Validators.required]),
      amount: new FormControl(data ? data.pricing.amount: '', [Validators.required]),
      rate: new FormControl(data ? data.pricing.rate: '', [Validators.required]),
      stone_rate: new FormControl(data ? data.pricing.stone_rate: 0,[Validators.required]),
      stone_weight: new FormControl(data ? data.pricing.stone_weight: 0,[Validators.required]),
      stone_amount: new FormControl(data ? data.pricing.stone_amount: 0, [Validators.required]),
      vat_price: new FormControl(data ? data.pricing.vat_price: '',[Validators.required])
    });

    this.filteredOptions = this.itemForm.controls.code.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.code)),
      map(name => (name ? this._filter(name) : this.dummyItemList.slice())),
    );

    this.componentService.getOrnaments().subscribe((resp) => {
      this.dummyItemList = resp;
    }, err =>{
      console.log("Error fetching items list");
    });

    this.componentService.getMaterials().subscribe((resp)=>{
      this.materials = resp;
    }, err =>{
      console.log("Error fetching HSNS");
    });

    this.itemForm.controls.net_wt.valueChanges.subscribe((res)=>{
      console.log("Result Variable",res);
      console.log(this.itemForm.value.net_wt);
      this.findOrnPrice(this.itemForm.value.rate,  res, this.itemForm.value.vat);
      this.findStonePrice(this.itemForm.value.gross_wt, res, this.itemForm.value.stone_rate);
    });

    this.itemForm.controls.rate.valueChanges.subscribe((res)=>{
      this.findOrnPrice(res, this.itemForm.value.net_wt, this.itemForm.value.vat);
    });

    this.itemForm.controls.material.valueChanges.subscribe((res)=>{
      console.log("Material Changed", res);
      this.itemForm.patchValue({
        rate:res.rate
      });
    })

    this.itemForm.controls.vat.valueChanges.subscribe((res)=>{
      this.findVatPrice(res, this.itemForm.value.price);
    })

    this.itemForm.controls.gross_wt.valueChanges.subscribe((res)=>{
      this.findStonePrice(res, this.itemForm.value.net_wt, this.itemForm.value.stone_rate);
    })

    this.itemForm.controls.stone_rate.valueChanges.subscribe((res)=>{
      this.findStonePrice(this.itemForm.value.gross_wt, this.itemForm.value.net_wt, res);
    })

    this.itemForm.controls.price.valueChanges.subscribe((res)=>{
      this.findAmount(res, this.itemForm.value.vat_price, this.itemForm.value.stone_amount);
    })
    this.itemForm.controls.vat_price.valueChanges.subscribe((res)=>{
      this.findAmount(this.itemForm.value.price, res, this.itemForm.value.stone_amount);
    })
    this.itemForm.controls.stone_amount.valueChanges.subscribe((res)=>{
      this.findAmount(this.itemForm.value.price, this.itemForm.value.vat_price, res);
    })

  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.itemForm.controls[controlName].hasError(errorName);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  displayFn(orn: Ornament): string {
    // if(orn){
    //   this.itemForm.patchValue({
    //     name:orn.name,
    //     material:orn.material.name,
    //     vat:orn.vat,
    //     gross_wt:orn.gross_wt,
    //     net_wt:orn.net_wt,
    //     unit:'g'
    //   });
    // }
    return orn && orn.code ? orn.code : '';
  }

  optionSelected(orn: any) {
    console.log("Option selected", orn);
    if(orn){
      // this.selectedMaterial = 
      this.ornmanent = orn;
      this.itemForm.patchValue({
        name:orn.name,
        material:orn.material,
        vat:orn.vat,
        gross_wt:orn.gross_weight,
        net_wt:orn.net_weight,
        unit:'g',
        vat_price:0,
        stone_rate:orn.stone_price
      });
      this.itemForm.patchValue({
        rate:orn.material.rate
      });
      this.findOrnPrice(orn.material.rate, orn.net_weight, orn.vat);
      this.findStonePrice( orn.gross_weight, orn.net_weight, orn.stone_price);
      this.findAmount(this.price, this.vat_amount, this.stone_price);
    }
  }

  private _filter(code: string): Ornament[] {
    const filterValue = code.toLowerCase();

    return this.dummyItemList.filter(option => option.code.toLowerCase().includes(filterValue));
  }

  public materialSelected(mtrl:any){
    console.log("Material Selected",mtrl);
    if(mtrl.rate){
      this.itemForm.patchValue({
        rate:mtrl.rate
      });
    }
  }

  public findOrnPrice(rate, net_wt, vat){
    if((rate)&&(net_wt)){
      this.itemForm.patchValue({
        price: Number((rate * net_wt).toFixed(2))
      })
    }
    this.price = Number((rate * net_wt).toFixed(2));
    this.findVatPrice(vat,rate * net_wt);
  }

  public findVatPrice(vat, price){
    if((vat || (vat == 0))&&(price || (price == 0))){
      this.itemForm.patchValue({
        vat_price: Number((( price * vat ) / 100).toFixed(2))
      })
      this.vat_amount = Number((( price * vat ) / 100).toFixed(2));
    }
  }

  public findStonePrice(gross_wt, net_wt, stone_rate){
    if(gross_wt && net_wt && (stone_rate || (stone_rate == 0))){
      this.itemForm.patchValue({
        stone_weight: Number((gross_wt - net_wt).toFixed(2)),
        stone_amount: Number((( gross_wt - net_wt ) * stone_rate).toFixed(2))
      })
      this.stone_price = Number((( gross_wt - net_wt ) * stone_rate).toFixed(2));
    }
  }

  public findAmount(price, vat, stone_price){
    if(price && (vat || (vat == 0)) && (stone_price || stone_price == 0)){
      this.itemForm.patchValue({
        amount: price + vat + stone_price
      });
    }
  }

  public confirmDialog(): void {
    if(this.itemForm.valid){
      this.dialogRef.close({ pricing:this.itemForm.value, item:this.ornmanent, index:this.index});
    }
  }

}
