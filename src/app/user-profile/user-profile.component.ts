import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ProfileData } from 'app/interfaces';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileData: ProfileData;
  constructor( private profileService:ProfileService ) { }

  ngOnInit() {
    this.profileService.getProfileDetails().subscribe((resp)=>{

      this.profileData = resp[0];
      console.log(this.profileData);
    }, err =>{
      console.log(err);
    })
  }

}
