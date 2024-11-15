import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  //Es para actualizar la aplicacion con el ion-refresher
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  //Lista de veterianarias
  veterinarias = [
    {
      nombre: 'Posta veterinaria',
      direccion: 'Crucero 1929, Puerto Montt, Los Lagos',
      telefono: '+56652260270',
      lat: -41.4771299042494, 
      lng: -72.96795516210572
    },
    {
      nombre: 'Clínica Veterinaria Puerto Montt',
      direccion: 'Crucero 2045,Puerto Montt, Los Lagos',
      telefono: '+56652286709',
      lat: -41.479069185945974, 
      lng: -72.97005135278948
    },
    {
      nombre: 'Clínica Veterinaria Austral',
      direccion: 'Av. Pdte. Ibáñez 0312, Puerto Montt, Los Lagos',
      telefono: '+56652430010',
      lat: -41.46242338476351, 
      lng: -72.93387587487834
    },
    {
      nombre: 'Consulta Veterinaria Mirasol',
      direccion: 'C. Las Tepas 1166, Puerto Montt, Los Lagos',
      telefono: '+56652543352',
      lat: -41.47953028576419, 
      lng: -72.99056541290949
    },
    {
      nombre: 'Clínica Veterinaria Arca del Puerto',
      direccion: 'vía romana, Av. Cardonal 1800, Puerto Montt, Los Lagos',
      telefono: '+56652435352',
      lat: -41.46875428035077, 
      lng: -72.96977058162504
    },
    {
      nombre: 'Hospital Clinico Veterinario del Lago',
      direccion: 'San francisco 990 Sector Lintz, Puerto Montt, Los Lagos',
      telefono: '+56652276969',
      lat: -41.46729786415516, 
      lng: -72.91968280616283
    },
    {
      nombre: 'Centro Medico Veterinario Oriente',
      direccion: 'Volcán Puntiagudo 1251, Puerto Montt, Los Lagos',
      telefono: '+56956039637',
      lat: -41.45284388650769, 
      lng: -72.9234264761028
    },
    {
      nombre: 'Clínica Veterinaria Survet',
      direccion: 'Isla Robinson Crusoe 6341, Puerta Sur, Puerto Montt, Los Lagos',
      telefono: '+56982440045',
      lat: -41.468874331254845, 
      lng: -72.99574262947615
    },
    {
      nombre: 'Veterinaria Mascota Planet',
      direccion: 'Av. Violeta Parra 5191, Alerce, Los Lagos',
      telefono: '+56958117383',
      lat: -41.39794947381324, 
      lng: -72.90446104052059
    },
    {
      nombre: 'Clínica Veterinaria Sanispet',
      direccion: 'Pto Lirquén 2138, Puerto Montt, Los Lagos',
      telefono: '+56990949272',
      lat: -41.47825257134803, 
      lng: -72.99025429389394
    }
  ];
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  //Dirige al google maps cada direccion de las veterinarias
  abrirEnGoogleMaps(lat: number, lng: number) {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_system');
  }
  
}
