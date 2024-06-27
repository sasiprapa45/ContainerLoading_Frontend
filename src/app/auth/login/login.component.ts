import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private message: NzMessageService,private fb: FormBuilder,) 
  {
    this.loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });}

  login(): void {
    if (this.loginForm.valid) {
      
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user_id', response.id);
          this.router.navigate(['/home/projects']);
        },
        (error: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.non_field_errors) {
              errorMessage = error.error.non_field_errors.join(', ');
            } else if (typeof error.error === 'object') {
              errorMessage = JSON.stringify(error.error);
            }
          }
          alert(errorMessage); // Show alert with error message
        }
        );
    } else {
     
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          
        }
      });
      alert('Please fill in all fields');
    }
  }

}
