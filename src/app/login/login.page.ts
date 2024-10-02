import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService
    
  ) {
    // Inicializa loginForm en el constructor
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Si lo prefieres, puedes dejar el código aquí, pero no es necesario
  }

  login() {
    this.authService.login(this.email, this.password);
  }

  
}
