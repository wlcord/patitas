import { Component, OnInit } from '@angular/core';
import { RegistrarService } from '../services/registrar.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  mascotas: any[] = []; // Array para almacenar las mascotas del usuario logueado
  rut_Dueño: string = '';
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
    private RegistrarService: RegistrarService
  ) {}

  ngOnInit(): void {
    const rutDueño = localStorage.getItem('Rut');
    this.Mascota.Rut_dueño = rutDueño ? rutDueño : '';
    
    const rut = localStorage.getItem('Rut');
    this.rut_Dueño = rut !== null ? rut : '';  
    this.obtenerMascotas();
  }

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
    console.log(`Edad en meses totales: ${totalMeses}`); // Si necesitas guardar en meses totales
  }

  registrarMascota() {
    // Obtiene la fecha actual
    const fechaActual = new Date();

    // Agrega la fecha actual
    this.Mascota.fechaRegistro = fechaActual.toISOString();
    this.RegistrarService.registrarMascota(this.Mascota).then(() => {
      console.log('Mascota registrado con éxito');
    }).catch(error => {
      console.error('Error al registrar la mascota:', error);
    });
  }

  obtenerMascotas() {
    this.RegistrarService.obtenerMascotasPorDueño(this.rut_Dueño).subscribe((data: any) => {
      this.mascotas = data.map((e: any) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() // Obtener los datos de la mascota
        };
      });
      console.log(this.mascotas)
    });
  }

}
