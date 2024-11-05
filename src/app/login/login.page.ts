import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RegistrarService } from '../services/registrar.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loginError!: string;
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  direccion: string = '';
  telefono: string = '';
  rut: string = '';
  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    
  ) {
    // Inicializa loginForm en el constructor
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    
  }

  login() {
    this.authService.login(this.email, this.password);
  }

  registrarUsuario() {
    if (this.email && this.password) {
      this.afAuth.createUserWithEmailAndPassword(this.email, this.password).then((userCredential) => {
        const uid = userCredential.user?.uid;

        if (uid) {
          this.firestore.collection('Dueño_Mascota').doc(uid).set({
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            password: this.password,
            direccion: this.direccion,
            telefono: this.telefono,
            rut: this.rut
          }).then(() => {
            console.log('Usuario registrado y datos guardados en Firestore');
          }).catch((error) => {
            console.error('Error al guardar los datos del usuario:', error);
          });
        }
      }).catch((error) => {
        console.error('Error al registrar usuario:', error);
      });
    }
}
  
}
