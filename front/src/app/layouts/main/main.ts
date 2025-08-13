import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar";
import { RouterOutlet } from '@angular/router';
import { Footer } from "../../components/footer/footer";
@Component({
  selector: 'app-main',
  imports: [NavbarComponent, RouterOutlet, Footer],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class MainLayoutComponent {

}
