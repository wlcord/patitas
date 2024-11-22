import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map, Subscription } from 'rxjs';
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
    ) { }

  ngOnInit() {
    // Obtener el ID de la mascota
    this.mascotaId = this.route.snapshot.paramMap.get('id')!;

    this.obtenerEstablecimientos();
    this.obtenerCitas();
  }

  Volver() {
    this.navCtrl.navigateBack('/tabs/tab2'); // O usa historial automáticamente
  }

  async obtenerEstablecimientos() {
    try {
      const establecimientosObservable = this.firestore
        .collection('Establecimiento')
        .valueChanges({ idField: 'id' });

      if (establecimientosObservable) {
        this.subscription = establecimientosObservable.subscribe((data) => {
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
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  

  async obtenerCitas() {
    try {
      const citasObservable = this.firestore
        .collection('Cita')
        .valueChanges({ idField: 'id' });
  
      if (citasObservable) {
        citasObservable.subscribe((data) => {
          this.citas = data.map((cita: any) => ({
            ...cita,
            fecha: cita.fecha?.toDate(), // Convierte el Timestamp a Date
          }));
          console.log('Citas obtenidas:', this.citas);
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
        fecha: new Date(this.cita.fecha), // Asegúrate de que la fecha esté en formato correcto
      });
  
      alert('Cita registrada con éxito');
      this.cita = {}; // Reinicia el formulario
    } catch (error) {
      console.error('Error al registrar la cita:', error);
      alert('Hubo un error al registrar la cita.');
    }
  }
  



  

}

