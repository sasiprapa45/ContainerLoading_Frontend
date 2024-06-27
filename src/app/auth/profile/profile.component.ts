import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  userId!: number;
  isEditMode = false;



  constructor(
    private fb: NonNullableFormBuilder,
    private userService: AuthService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
    username: [{ value: '', disabled: true }, Validators.required],
    first_name: [{ value: '', disabled: true }, Validators.required],
    last_name: [{ value: '', disabled: true }, Validators.required],
    age: [{ value: '', disabled: true }, [Validators.required,Validators.min(10)]],
    address: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
  });

}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('user_id'));
    this.userService.getUser(this.userId).subscribe(user => {
      this.userForm.patchValue(user);
    });
  }

  enableEdit(): void {
    this.isEditMode = true;
    this.userForm.enable();
  }

  disableEdit(): void {
    this.userService.getUser(this.userId).subscribe(user => {
      this.userForm.patchValue(user);
    });
    this.isEditMode = false;
    this.userForm.disable();
  }

  saveUser(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userId, this.userForm.value).subscribe(
        () => {
          this.disableEdit();
          alert('User updated successfully');
        },
        error => {
          console.error('Error updating user:', error);
        }
      );
    }else{
      Object.values(this.userForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      alert('Please fill out the information correctly and completely.');
    }
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.userId).subscribe(
        () => {
          alert('User deleted successfully');
          this.userService.logout();
          // Redirect to user list or another appropriate action
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
}
