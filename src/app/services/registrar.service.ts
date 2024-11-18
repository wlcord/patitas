import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { firstValueFrom, Observable  } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  constructor(
    private firestore: AngularFirestore, 
    private router: Router,
    private afAuth: AngularFireAuth) { }

  // Método para registrar dueño de mascota
  registrarDueño(datosDueño: any) {
    return this.firestore.collection('Dueño_Mascota').add(datosDueño);
  }

  // Método para registrar mascota
  registrarMascota(datosMascota: any) {
    return this.firestore.collection('Mascota').add(datosMascota);
  }

  // Obtener vacunas por rut de mascota
  obtenerVacunas(rutMascota: string) {
    return this.firestore
      .collection('Vacuna', ref => ref.where('Rut_mascota', '==', rutMascota))
      .snapshotChanges();
  }
    // Método para registrar vacuna
    registrarVacuna(datosVacuna: any) {
      return this.firestore.collection('Vacuna').add(datosVacuna);
    }

  
}
