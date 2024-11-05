import { Component, OnInit } from '@angular/core';
import { RegistrarService } from '../services/registrar.service'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  usuario: any;


  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];

  constructor(
    private RegistrarService: RegistrarService,
    private authService: AuthService
  ) {

   }

    async ngOnInit() {
      try {
        // Obtén los datos del usuario
        const userDataObservable = await this.authService.getUserData();
        if (userDataObservable) {
          userDataObservable.subscribe((data) => {
            this.usuario = data;
            localStorage.setItem('Nombre', this.usuario.nombre);
            console.log('Datos del usuario:', this.usuario);
          });
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    }
  }
  

  

  
  
  
  
  
  
  


