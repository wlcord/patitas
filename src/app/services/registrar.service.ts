import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { firstValueFrom, Observable  } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  constructor(
    private firestore: AngularFirestore, 
    private router: Router,
    private afAuth: AngularFireAuth,
    private Firestore: Firestore) 
    { }

  // Método para registrar mascota
  registrarMascota(datosMascota: any) {
    return this.firestore.collection('Mascota').add(datosMascota);
  }

  async eliminarMascota(id: string) {
    return this.firestore.collection('Mascota').doc(id).delete();
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

  async eliminarVacuna(id: string) {
    return this.firestore.collection('Vacuna').doc(id).delete();
  }

  //Receta

  // Metodo para guardar los datos extraidos con el OCR de la camara en una coleccion de Firestore
  async guardarDatosenColeccion(collectionName: string, data: any): Promise<void> {
    const colRef = collection(this.Firestore, collectionName);
    await addDoc(colRef, data);
  }

  obtenerReceta(rutUsuario: string) {
    return this.firestore
      .collection('Recetas', ref => ref.where('rut', '==', rutUsuario))
      .snapshotChanges();
  }
  
  //Citas

  // Metodo para eliminar una cita ya registrada en la coleccion de 'Cita'
  async deleteCita(id: string) {
    return this.firestore.collection('Cita').doc(id).delete();
  }
  

  
}
