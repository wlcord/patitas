import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'
import { RegistrarService } from '../services/registrar.service';
import { AuthService } from '../services/auth.service';
import { getAuth } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  mascotas: any[] = []; // Array para almacenar las mascotas del usuario logueado
  rut_Dueño: string = ''; //Variable para guardar el rut del dueño
  usuario: any; //Guarda los datos del usuario
  
  
  
  //Aca se guarda los datos de la mascota
  Mascota = {
    Nombre: '',
    Edad: '',
    Anos: 0,
    Meses: 0,
    Raza: '',
    Especie: '',
    Sexo: '',
    Color: '',
    Esterilizado: '',
    Rut_mascota: '',
    Rut_dueño: '',
    fechaRegistro: ''
  }

  razasPerro = ['Labrador', 'Pastor Alemán', 'Bulldog francés', 'Golden Retriever', 'Husky siberiano', 'Chihuahua', 'Pit bull terrier americano', 'Beagle', 'Mastín', 'Dóberman', 'Rottweiler', 'Mestizo (Quiltro)'];
  razasGato = ['Persa', 'Siamés', 'Bengalí', 'Sphynx', 'Azul ruso', 'Angora', 'Siberiano', 'Maine Coon', 'Bombay', 'Curl americano', 'Ragdoll'];
  razasDisponibles: string[] = [];


  constructor(
    private RegistrarService: RegistrarService,
    private AuthService: AuthService,
    private authService: AuthService,
    private firebase: FirebaseService,
    private router: Router
  ) {}

   async ngOnInit() {

    try {
      // Obtén los datos del usuario
      const userDataObservable = await this.authService.getUserData();
      if (userDataObservable) {
        userDataObservable.subscribe((data) => {
          this.usuario = data;
          localStorage.setItem('Nombre', this.usuario.nombre);
          console.log('Datos del usuario:', this.usuario);
        });
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }

    const rutDueño = localStorage.getItem('Rut');
    this.Mascota.Rut_dueño = rutDueño ? rutDueño : '';
  
    try {
      //Se obtienen las mascotas registradas del rut actual
      this.mascotas = await this.AuthService.getMascotas();
      console.log('Mascotas obtenidas:', this.mascotas);
    } catch (error) {
      console.error('Error al obtener las mascotas:', error);
    }

    this.Mascota.Rut_dueño = this.usuario.rut;
  }

  

  //Función pra actualizar las razas de las mascotas al momento de registrar
  actualizarRazas() {
    if (this.Mascota.Especie === 'Perro') {
      this.razasDisponibles = this.razasPerro;
    } else if (this.Mascota.Especie === 'Gato') {
      this.razasDisponibles = this.razasGato;
    } else {
      this.razasDisponibles = []; // Si no se selecciona una especie válida, no mostrar razas
    }
  }


  combinarEdad() {
    const totalMeses = this.Mascota.Anos * 12 + this.Mascota.Meses;
    this.Mascota.Edad = `${this.Mascota.Anos} años y ${this.Mascota.Meses} meses`;
    console.log(`Edad en meses totales: ${totalMeses}`); // Si se necesita los datos en meses se muestra en la consola
  }

  //Funcion para registrar a la mascota en la coleccion de firebase
  registrarMascota() {
    // Obtiene la fecha actual para el apartado de fecha de registro
    const fechaActual = new Date();

    // Se agrega la fecha actual y los datos de la mascota para su registro
    this.Mascota.fechaRegistro = fechaActual.toISOString();
    this.RegistrarService.registrarMascota(this.Mascota).then(() => {
      console.log('Mascota registrado con éxito');
    }).catch(error => {
      console.error('Error al registrar la mascota:', error);
    });
  }
  viewVacunas(mascotaRut: string) {
    // Redirige a la pagina de vacunas
    this.router.navigate([`/vacunas`, mascotaRut]);
  }

  RegistrarCita(mascota: string) {
    this.router.navigate([`/citas`, mascota]);
  }

}
