import { Component, OnInit } from '@angular/core';
import { RegistrarService } from '../services/registrar.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  receta: any[] = [];

  constructor(
    private firebaseService: RegistrarService,) {
    
  }
  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos() {
      // Obtén el RUT del usuario logueado
      const rutUsuario = localStorage.getItem('Rut');
  
      // Filtra los datos de la colección por el RUT
      await this.firebaseService.obtenerReceta(rutUsuario!).subscribe((data: any) => {
        this.receta = data.map((e: any) => {
          const recetas = e.payload.doc.data();
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }
        })
      });
    
  }

}
