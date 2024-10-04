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
    Raza: '',
    Especie: '',
    Sexo: '',
    Color: '',
    Esterilizado: '',
    Rut_mascota: '',
    Rut_dueño: ''
  }

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

  registrarMascota() {
    this.RegistrarService.registrarMascota(this.Mascota).then(() => {
      console.log('Mascota registrado con éxito');
    }).catch(error => {
      console.error('Error al registrar la mascota:', error);
    });
  }

  obtenerMascotas() {
    // Usar el servicio para obtener las mascotas por el RUT del dueño
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
