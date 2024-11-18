import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrarService } from '../services/registrar.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

interface VacunaData {
  Id_vacuna: number;
  fecha_aplicacion: Timestamp; // Define como Timestamp
}
@Component({
  selector: 'app-vacunas',
  templateUrl: './vacunas.page.html',
  styleUrls: ['./vacunas.page.scss'],
})
export class VacunasPage implements OnInit {

  rut_url:string | null = null;
  vacunas: any[] = [];
  idsvacunasArray: string[] = [];

  vacunaData = {
    Rut_mascota: '',
    Id_vacuna: '',
    fecha_aplicacion: null as Timestamp | null,
  };

  


  
  constructor(
    private RegistrarService: RegistrarService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
    
  ) { 
  }

  ngOnInit() {

    this.rut_url = this.route.snapshot.paramMap.get('id');
    console.log('Url_ID:', this.rut_url);

    this.obtenerVacuna();
    this.idMascotarellenar()
  }

  formatearFecha(fecha: string | Date): string {
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = fechaObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  obtenerVacuna() {
    if (!this.rut_url) {
      console.error('rut_url no está definido');
      return;
    }
    // Usar el servicio para obtener las vacunas por mascota
    this.RegistrarService.obtenerVacunas(this.rut_url).subscribe((data: any) => {
      this.vacunas = data.map((e: any) => {
        const vacuna = e.payload.doc.data();
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data(), // Obtener los datos de la mascota
          fecha_aplicacion: this.formatearFecha(vacuna.fecha_aplicacion.toDate()),
        };
      });
      console.log(this.vacunas)
      this.idsvacunasArray = this.obtenerIdsVacunas();
    });
  }
  obtenerIdsVacunas(): string[] {
    return this.vacunas.map(vacuna => vacuna.Id_vacuna);
  }

  getMensajesPorVacuna(id: number): string[] {
    switch (id) {
      case 1:
        return ['Antirrábica', 'Es la única manera de prevenir la rabia, una enfermedad mortal para los animales y los humanos.', 'Anual'];
      case 2:
        return ['Sextuple', ' Protege contra las siguientes enfermedades: Parvovirosis, Distemper Canino, Hepatitis Infecciosa Canina y Leptospira', 'Anual'];
      case 3:
        return ['Octuple', 'Protege contra las siguientes enfermedades: Parvovirosis, Distemper Canino, Hepatitis Infecciosa Canina, Leptospira 2 cepas y Coronavirus', 'Anual'];
      case 4:
        return ['Bordetella bronchiseptica', ' Protege a los perros de la tos de las perreras, una enfermedad muy contagiosa que se transmite entre perros', 'Anual'];
      case 5:
        return ['Parainfluenza canina', 'Ayuda a prevenir la infección de Influenza canina y a reducir la gravedad de los síntomas si el perro ya lo contrae', 'Anual'];
      case 6:
        return ['Triple felina', 'Protege ante la Rinotraqueítis viral felina, el Calicivirus y la Panleucopenia felina', 'Anual'];
      case 7:
        return ['Leucemia felina', 'Principal forma de prevenir la Leucemia Felina (FeLV)', 'Anual'];
      default:
        return ['Vacuna personalizada', 'Vacuna no esperada en el sistema', 'No informacion'];
    }
  }
  idMascotarellenar() {
    if (!this.rut_url) {
      console.error('rut_url no está definido');
      return;
    }
    this.vacunaData.Rut_mascota = this.rut_url;
  }

  enviarFormulario() {
    this.firestore.collection('vacuna').add(this.vacunaData)
      .then(() => {
        console.log('Datos enviados a la colección "vacuna"');
        // Puedes mostrar un mensaje de éxito al usuario aquí
      })
      .catch(error => {
        console.error('Error al enviar los datos:', error);
        // Puedes mostrar un mensaje de error al usuario aquí
      });
  }
  registrarVacuna() {
  // Convierte el string de fecha en un objeto Timestamp
  const fecha = this.vacunaData.fecha_aplicacion 
  ? Timestamp.fromDate(
      this.vacunaData.fecha_aplicacion instanceof Timestamp
        ? this.vacunaData.fecha_aplicacion.toDate()
        : new Date(this.vacunaData.fecha_aplicacion as string) // Asegúrate de que no sea null aquí
    )
  : null;
  
  if (fecha) {
    this.vacunaData.fecha_aplicacion = fecha;
  } else {
    console.error('Fecha de aplicación no válida.');
  }
    this.RegistrarService.registrarVacuna(this.vacunaData).then(() => {
      console.log('Vacuna registrado con éxito');
    }).catch(error => {
      console.error('Error al registrar la Vacuna:', error);
    });
  }

}
