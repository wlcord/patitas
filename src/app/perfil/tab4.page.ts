import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  usuario: any = {
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    direccion: '',
  };
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
    private firestoreService: AuthService,
    private firestore: AngularFirestore
  ) {
   }

  ngOnInit(): void {
  }

  async obtenerPerfilPorRut(rutLogeado: string) {
    if (!rutLogeado) {
      console.error('No se encontró el RUT del usuario logueado.');
      return;
    }
  
    // Consulta a Firestore para traer solo el perfil que coincide con el rut
    this.firestore.collection('Dueño_Mascota', ref => ref.where('Rut', '==', rutLogeado))
      .valueChanges()
      .subscribe((perfiles: any[]) => {
        if (perfiles && perfiles.length > 0) {
          const perfilLogeado = perfiles[0];  // Asumimos que el rut es único y solo hay un perfil
          this.usuario = perfilLogeado;  // Asignamos el perfil al objeto usuario
          console.log('Perfil del usuario logeado:', this.usuario);
        } else {
          console.error('No se encontró un perfil que coincida con el RUT del usuario logueado.');
        }
      });
  }
  
  
  
  

}
