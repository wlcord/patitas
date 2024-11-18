import { Component } from '@angular/core';

import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  Nombre: string = ''; // Almacena el nombre de usuario
  

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
  
  }

  ngOnInit() {
    this.loadUserName();
  }

  //Se obtiene el nombre desde el local storage
  loadUserName() {
    const Nombre = localStorage.getItem('Nombre');
    this.Nombre = Nombre !== null ? Nombre : '';  
  }

  // Redirige a la página de login
  onLogin() {
    this.navCtrl.navigateForward('/login');
  }

  // Usa el método de logout de tu servicio de autenticación
  async onLogout() {
    await this.authService.logout(); 
  }

  
  
}
