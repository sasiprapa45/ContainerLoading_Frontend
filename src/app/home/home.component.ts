import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router:Router,private authService: AuthService){}

  goNewProject(pageName:string):void{
    this.router.navigate([`/home/${pageName}`])
  }
  logout():void{
    this.authService.logout();
  }
}
