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
  Nombre: string | null = null; // Almacena el nombre de usuario
  

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
  
  }

  ngOnInit() {
    this.loadUserName();
  }

  loadUserName() {
    this.Nombre = localStorage.getItem('Nombre'); // Obtén el nombre desde localStorage
  }

  onLogin() {
    // Redirige a la página de login
    this.navCtrl.navigateForward('/login');
  }

  async onLogout() {
    try {
      await this.authService.logout(); // Usa el método de logout de tu servicio de autenticación
      localStorage.removeItem('Nombre');
      this.navCtrl.navigateRoot('/login');  // Redirigir a la página de login
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  }
}
