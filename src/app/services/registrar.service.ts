import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  constructor(private firestore: AngularFirestore, private router: Router) { }

  // Método para registrar dueño de mascota
  registrarDueño(datosDueño: any) {
    return this.firestore.collection('Dueño_Mascota').add(datosDueño);
  }

  // Método para registrar mascota
  registrarMascota(datosMascota: any) {
    return this.firestore.collection('Mascota').add(datosMascota);
  }

  // Método para obtener mascotas por RUT del dueño
  obtenerMascotasPorDueño(rutDueño: string) {
    return this.firestore
      .collection('Mascota', ref => ref.where('Rut_dueño', '==', rutDueño))
      .snapshotChanges();
  }
}
