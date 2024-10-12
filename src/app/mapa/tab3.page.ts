import { Component, OnInit } from '@angular/core';
import { GoogleMap } from '@capacitor-community/google-maps';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  map: any;
  userLocation: any;

  constructor() {}

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    // Obtener la geolocalización del dispositivo
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true // Alta precisión
    });
    
    const myLatLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // Inicializar el mapa
    const mapEle = document.getElementById('map');
    if (mapEle) {
      this.map = new google.maps.Map(mapEle, {
        center: myLatLng,
        zoom: 15 // Aumentamos el zoom para ver mejor la ubicación actual
      });

      // Agregar marcador en la ubicación del usuario
      const marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'Mi ubicación actual'
      });
    }
  }
  
}
