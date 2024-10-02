import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore: AngularFirestore, private router: Router) { }

  // Método para iniciar sesión con Firestore
  async login(email: string, password: string) {
    try {
      // Realiza la consulta para obtener los documentos donde el email coincida
      const snapshot = await firstValueFrom(
        this.firestore.collection('Dueño_Mascota', ref => ref.where('Email', '==', email)).get()
      );

      // Verifica que el snapshot no sea undefined y no esté vacío
      if (snapshot && !snapshot.empty) {
        let loginSuccess = false;  // Indicador de éxito en el login

        snapshot.forEach(doc => {
          const data: any = doc.data(); // Accede a los datos del documento
          
          // Verifica si el password coincide
          if (data.Password === password) {
            console.log('Login exitoso');
            localStorage.setItem('Nombre', data.Nombre);
            this.router.navigate(['/tabs/tab1']); // Redirige a la página principal
            loginSuccess = true;
          }
        });

        if (!loginSuccess) {
          // Si no se encontró el password correcto
          console.error('Contraseña incorrecta');
        }
      } else {
        console.error('Email no encontrado');
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  }

  async logout() {
    try {
      // Limpiar el localStorage
      localStorage.removeItem('username');
      console.log('Logout exitoso');
      this.router.navigate(['/login']); // Redirigir a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }

  isUserLoggedIn(): boolean {
    const username = localStorage.getItem('username');
    return username !== null; // Devuelve true si hay un nombre de usuario en localStorage
  }


  // Tipado explícito del tipo de datos que esperas obtener de la colección
  async obtenerdatos(collectionName: string): Promise<any[]> {
    try {
      // Obtiene todos los documentos de la colección especificada
      const snapshot = await firstValueFrom(
        this.firestore.collection(collectionName).get()
      );

      // Verifica que el snapshot no esté vacío
      if (!snapshot.empty) {
        const documents = snapshot.docs.map(doc => {
          const data = doc.data() as { [key: string]: any };  // Tipado explícito para evitar 'unknown'
          return { id: doc.id, ...data };  // Ahora data tiene el tipo correcto
        });
        console.log('Documentos obtenidos:', documents);
        return documents;
      } else {
        console.log('No se encontraron documentos en la colección.');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      return [];
    }
  }
}
