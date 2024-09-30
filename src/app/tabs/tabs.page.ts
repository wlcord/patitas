import { Component } from '@angular/core';
import { ParseService } from '../services/parse.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isLoggedIn: boolean = false;
  username: string | null = null;

  constructor(
    private parseService: ParseService,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.username = localStorage.getItem('username'); // Obtén el nombre de usuario

    this.router.events.subscribe(() => {
      this.username = localStorage.getItem('username'); // Actualiza el nombre al navegar
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.parseService.isUserLoggedIn();
  }

  onLogin() {
    // Redirige a la página de login
    this.navCtrl.navigateForward('/login');
  }

  async onLogout() {
    try {
      await this.parseService.logout();
      this.isLoggedIn = false;
      localStorage.removeItem('username');
      this.navCtrl.navigateRoot('/login');  // Redirigir a la página principal
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  }

}
