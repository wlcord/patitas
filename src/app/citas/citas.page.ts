import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { RegistrarService } from '../services/registrar.service';





@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit , OnDestroy{
  
  
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }
  private subscription: Subscription = new Subscription;

  mascotaId: string = '';
  citas: any[] = []; // Lista de citas
  establecimientos: any[] = []; // Lista de establecimientos
  cita: any = {}; // Modelo para la nueva cita


  constructor(
    private route: ActivatedRoute, 
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private navCtrl: NavController,
    private registrarservice: RegistrarService,
    private platform: Platform,
    ) { }

  ngOnInit() {
    // Obtener el ID de la mascota
    this.mascotaId = this.route.snapshot.paramMap.get('id')!;

    this.obtenerEstablecimientos();
    this.obtenerCitas(this.mascotaId);
    
    
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  Volver() {
    this.navCtrl.navigateBack('/tabs/tab2');
  }

  async obtenerEstablecimientos() {
    try {
      const establecimientosObservable = this.firestore
        .collection('Establecimiento ')
        .valueChanges({ idField: 'id' });

      if (establecimientosObservable) {
        establecimientosObservable.subscribe((data) => {
          this.establecimientos = data.map((establecimiento: any) => ({
            ...establecimiento,
          }));
          console.log('Establecimientos obtenidos:', this.establecimientos);
        });
      }
    } catch (error) {
      console.error('Error al obtener los establecimientos:');
    }
  }

  async obtenerCitas(rutMascota: string) {
    try {
      const citasObservable = this.firestore
        .collection('Cita', (ref) =>
          ref.where('mascotaId', '==', rutMascota) // Filtra por el RUT de la mascota
        )
        .valueChanges({ idField: 'Rut_mascota' });
  
      if (citasObservable) {
        citasObservable.subscribe((data) => {
          this.citas = data.map((cita: any) => ({
            ...cita,
            fecha: cita.fecha?.toDate(), // Convierte el Timestamp a Date
          }));
          console.log('Citas obtenidas para el RUT:', rutMascota, this.citas);
        });
      }
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
  }
  
  

  // Registrar nueva cita en Firestore
  async registrarCita() {
    try {
      // Obtén el ID de la mascota desde la URL
      this.cita.mascotaId = this.route.snapshot.paramMap.get('id')!;
  
      // Asegúrate de que haya un ID válido antes de continuar
      if (!this.cita.mascotaId) {
        alert('No se encontró el ID de la mascota. No se puede registrar la cita.');
        return;
      }
  
      const citasRef = this.firestore.collection('Cita');
      await citasRef.add({
        ...this.cita,
        fecha: new Date(this.cita.fecha), 
      });
  
      alert('Cita registrada con éxito');
      this.cita = {}; // Reinicia el formulario
    } catch (error) {
      console.error('Error al registrar la cita:', error);
      alert('Hubo un error al registrar la cita.');
    }
  }
  
  deleteCita(id: string): void {
    this.registrarservice.deleteCita(id).then(() => {
      console.log('Cita eliminada exitosamente');
      // Actualiza la lista de citas si es necesario
      this.obtenerCitas(id);
    }).catch(error => {
      console.error('Error al eliminar la cita:', error);
    });
  }

}

