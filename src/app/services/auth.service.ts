import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  email: string = '';
  password: string = '';
  rut: string= '';

  constructor(
    private firestore: AngularFirestore, 
    private router: Router,
    private afAuth: AngularFireAuth) { 
      // Escucha los cambios de autenticación y guarda/elimina el UID en localStorage
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          localStorage.setItem('userUID', user.uid);
          console.log('UID guardado en localStorage:', user.uid);
        } else {
          localStorage.removeItem('userUID');
          console.log('Usuario no autenticado, UID eliminado de localStorage');
        }
      });
    }

  // Función de login con email y contraseña
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Inicio de sesión exitoso:', userCredential);

      this.router.navigate(['/tabs/tab3']); // Redirige a la página de inicio
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      localStorage.removeItem('userUID'); // Limpia el UID del localStorage 
      await this.afAuth.signOut();
      this.router.navigate(['/login']) // Cierra la sesión de Firebase
      console.log('Usuario ha cerrado sesión');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Función para obtener el UID 
  getUserUID(): string | null {
    return localStorage.getItem('userUID');
  }

  // Función para obtener los datos del usuario desde Firestore
  async getUserData() {
    try {
      const uid = this.getUserUID();
      if (uid) {
        const userDoc: AngularFirestoreDocument = this.firestore.doc(`Dueño_Mascota/${uid}`);
        return userDoc.valueChanges(); // Observable con los datos del usuario
      } else {
        throw new Error('UID no disponible');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw error;
    }
  }

  isUserLoggedIn(): boolean {
    const username = localStorage.getItem('username');
    return username !== null; // Devuelve true si hay un nombre de usuario en localStorage
  }

  // Función para obtener el RUT del usuario desde Firestore
  async getUserRut(): Promise<string | null> {
    const uid = await this.getUserUID(); 
    if (uid) {
      const userDoc = this.firestore.doc(`Dueño_Mascota/${uid}`);
      const userData = await userDoc.ref.get();
      const user = userData.data();
      
      
      // Verifica si user es un objeto y contiene el campo `rut`
      if (user && typeof user === 'object' && 'rut' in user) {
        console.log(user.rut)
        return user.rut as string; // Asegura que el valor de `rut` es una cadena
      } else {
        throw new Error('El documento no contiene el campo rut');
      }
    } else {
      throw new Error('UID no disponible');
    }
  }
  

  // Función para obtener las mascotas del usuario según el RUT
  async getMascotas(): Promise<any[]> {
    const rut = await this.getUserRut();
    if (rut) {
      const mascotasSnapshot = await this.firestore.collection('Mascota', ref => ref.where('Rut_dueño', '==', rut)).get().toPromise();
      
      // Verificación adicional para asegurarnos de que mascotasSnapshot no sea undefined
      if (mascotasSnapshot && !mascotasSnapshot.empty) {
        return mascotasSnapshot.docs.map(doc => doc.data()); // Devuelve un array de las mascotas
      } else {
        throw new Error('No se encontraron mascotas para el RUT proporcionado');
      }
    } else {
      throw new Error('No se pudo obtener el RUT del usuario');
    }
  }
  
}
