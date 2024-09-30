import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ParseService } from '../services/parse.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loginError!: string;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private parseService: ParseService
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

  async Login() {
    const { email, password } = this.loginForm.value;
    try {
      const user = await this.parseService.loginCustom(email, password);
      console.log('Usuario autenticado correctamente', user);

      // Almacena el nombre en una variable
      localStorage.setItem('username', user.get('Nombre'));
      // Redirige a la página principal después de la autenticación exitosa
      this.navCtrl.navigateRoot('/tabs/tab1');
    } catch (error) {
      this.loginError = 'Error al iniciar sesión: ', error;
    }
  }
}
