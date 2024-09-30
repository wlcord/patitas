import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  map!: mapboxgl.Map;

  constructor() {}

  ngOnInit(): void {
    this.buildMap();
  }

  buildMap() {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoid2xhZGltaXIxIiwiYSI6ImNtMWZ2ZGEzdTI0cm8ycW9vNThiNWE1azQifQ.7XnLJQ8419e_U--c3oEm5g';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Coordenadas iniciales [longitud, latitud]
      zoom: 9 // Nivel de zoom inicial
    });
  }

}
