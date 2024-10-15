import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Plugins } from '@capacitor/core';


const { Calendar } = Plugins;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  allDocuments: any[] = [];
  Titulo: string = '';
  Lugar: string = '';
  Nota: string = '';
  Fechainicio: string = '';
  Fechafin: string = '';

  constructor(private firestoreService: AuthService) {
    
  }

  async perfiles() {
    this.allDocuments = await this.firestoreService.obtenerdatos('Dueño_Mascota');
    console.log(this.allDocuments);
  }

  async agregarEvento() {
    const start = new Date(this.Fechainicio);
    const end = new Date(this.Fechafin);

    try {
      // Crear evento en el calendario
      await Calendar['createEvent']({
        title: this.Titulo,
        location: this.Lugar,
        notes: this.Nota,
        startDate: start,
        endDate: end
      });

      alert('Evento creado en el calendario');
    } catch (error) {
      alert('Error al crear evento: ' + error);
    }
  }
}
