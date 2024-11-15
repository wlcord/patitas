import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'
import { RegistrarService } from '../services/registrar.service';
import { AuthService } from '../services/auth.service';



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
    Identificador_mascota: '',
    Rut_dueño: '',
    fechaRegistro: ''
  }

  razasPerro = ['Labrador', 'Pastor Alemán', 'Bulldog francés', 'Golden Retriever', 'Husky siberiano', 'Chihuahua', 'Pit bull terrier americano', 'Beagle', 'Mastín', 'Dóberman', 'Rottweiler', 'Mestizo (Quiltro)'];
  razasGato = ['Persa', 'Siamés', 'Bengalí', 'Sphynx', 'Azul ruso', 'Angora', 'Siberiano', 'Maine Coon', 'Bombay', 'Curl americano', 'Ragdoll'];
  razasDisponibles: string[] = [];


  constructor(
    private RegistrarService: RegistrarService,
    private AuthService: AuthService,
  ) {}

   async ngOnInit() {
    try {
      //Se obtienen las mascotas registradas del rut actual
      this.mascotas = await this.AuthService.getMascotas();
      console.log('Mascotas obtenidas:', this.mascotas);
    } catch (error) {
      console.error('Error al obtener las mascotas:', error);
    }
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


}
