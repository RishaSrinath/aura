import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });


  @Input() error: string | null;


  constructor( private authService: AuthService, private router: Router) { }
  submit() {
    if (this.form.valid) {
      console.log("Login Called",this.form.value.username,this.form.value.password);
      this.authService.login( this.form.value.username, this.form.value.password ).subscribe((resp:any)=>{
        console.log(resp);
        sessionStorage.setItem('token', resp.jwt);
        localStorage.setItem('user', JSON.stringify(resp.user));
        this.authService.getUserDetails().subscribe((resp1:any)=>{
          this.authService.setLoggedInStatus(true);
          this.router.navigate(['dashboard']);
          sessionStorage.setItem('user_details', JSON.stringify(resp1));
        }, err =>{
          console.log(err);
        })
        
      }, err =>{
        console.log("Error",err);
        $.notify({
          icon: "notifications",
          message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."

      },{
          type: 'danger',
          timer: 4000,
          placement: {
              from: 'top',
              align: 'right'
          },
          template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">notifications</i> ' +
            '<span data-notify="title">Login Failed</span> ' +
            '<span data-notify="message">Invalid username or password</span>' +
            '<div class="progress" data-notify="progressbar">' +
              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
      });

    }
  }

  ngOnInit(): void {
  }

}
