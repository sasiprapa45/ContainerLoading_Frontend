import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserFormRequest } from 'src/app/interfaces/insert-form';
import { AbstractControl, FormBuilder, FormGroup, Validators,ValidationErrors,ValidatorFn, FormControl, NonNullableFormBuilder, } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm!: FormGroup;



  constructor(private authService: AuthService, private router: Router,private fb: NonNullableFormBuilder) {
  this.registerForm = this.fb.group({
    username: [ '' , Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    age: ['', [Validators.min(10)]],
    confirm: ['', [Validators.required, this.confirmValidator]],
    address: ['']
  });

}

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        response => {
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.non_field_errors) {
              errorMessage = error.error.non_field_errors.join(', ');
            } else if (typeof error.error === 'object') {
              errorMessage = this.parseErrorMessages(error.error);
            }
          }
          alert(errorMessage); // Show alert with error message
        }
      );
    }else{
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      alert('Please fill out the information correctly and completely.');
    }
  }

  private parseErrorMessages(errorObj: any): string {
    let messages = [];
    for (let key in errorObj) {
      if (errorObj.hasOwnProperty(key)) {
        messages.push(...errorObj[key]);
      }
    }
    return messages.join(', ');
  }

  confirmValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return null;
  };


  backLogin() {
        this.router.navigate(['/login']);
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.registerForm.controls['confirm'].updateValueAndValidity());
  }

}
