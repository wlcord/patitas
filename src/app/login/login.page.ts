import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { RegistrarService } from '../services/registrar.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loginError!: string;
  email: string = '';
  password: string = '';
  dueno = {
    Nombre: '',
    Apellido: '',
    Email: '',
    Password:'',
    Direccion: '',
    Telefono: '',
    Rut: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private RegistrarService: RegistrarService
    
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

  registrarDueno() {
    this.RegistrarService.registrarDueño(this.dueno).then(() => {
      console.log('Dueño registrado con éxito');
    }).catch(error => {
      console.error('Error al registrar el dueño:', error);
    });
  }
  
}
