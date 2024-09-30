import { Injectable } from '@angular/core';
import Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class ParseService {
  constructor() {
    // Inicializar Parse con Application ID y JavaScript Key
    Parse.initialize('2YOct6hBeleNb3B7F2OnFPKKUJbZ4ExZvqo7v5AS', 'B3N10e6B7btTDcmOIXuXO3Q7K1SlzzaZcAzjtXCk');
    Parse.serverURL = 'https://parseapi.back4app.com/';
  }

  // Método para obtener los usuarios
  async getUsuarios(): Promise<any> {
    const Usuario = Parse.Object.extend('Usuario');
    const query = new Parse.Query(Usuario);
    try {
      const results = await query.find();
      return results.map(user => ({
        id: user.id,
        nombre: user.get('Nombre'),
        apellido: user.get('Apellido'),
        email: user.get('email'),
        password: user.get('password')
      }));
    } catch (error) {
      console.error('Error al consultar usuarios: ', error);
      throw error;
    }
  }

  // Método para autenticar con la tabla personalizada "Usuario"
  async loginCustom(email: string, password: string): Promise<any> {
    const Usuario = Parse.Object.extend('Usuario');
    const query = new Parse.Query(Usuario);
    query.equalTo('email', email);
    
    try {
      const result = await query.first();
      if (result && result.get('password') === password) { // Comparación simple (sin encriptación)
        return result; // Usuario autenticado correctamente
      } else {
        throw new Error('Email o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      throw error;
    }
  }

  isUserLoggedIn(): boolean {
    return Parse.User.current() != null;
  }

  async logout(): Promise<void> {
    try {
      await Parse.User.logOut();
    } catch (error) {
      throw new Error('Error al cerrar sesión');
    }
  }
}
