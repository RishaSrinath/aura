import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-material-dialogue',
  templateUrl: './material-dialogue.component.html',
  styleUrls: ['./material-dialogue.component.scss']
})
export class MaterialDialogueComponent implements OnInit {

  public materialForm: FormGroup;
  public id:any;
  constructor(public dialogRef: MatDialogRef<MaterialDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data){
        this.id = data.id;
        this.materialForm = new FormGroup({
          name:new FormControl( data.name, [Validators.required]),
          hsn:new FormControl( data.hsn, [Validators.required]),
          rate:new FormControl( data.rate, [Validators.required]),
        });
      }
    }

  ngOnInit(): void {
    
  }

}
