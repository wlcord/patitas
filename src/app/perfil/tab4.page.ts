import { Component, OnInit, inject } from '@angular/core';
import { RegistrarService } from '../services/registrar.service'
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { getAuth } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, getFirestore, updateDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  
  //Función para actualizar la app con el ion-refresher
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }
  //Función para seleccionar archivo
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.profilePic = event.target.files[0];
    }
  }
  

  profilePic: File | null = null;
  usuario: any; //Guarda los datos del usuario
  firestore: Firestore = getFirestore();

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];

  constructor(
    private RegistrarService: RegistrarService,
    private authService: AuthService,
    private firebase: FirebaseService
  ) {

   }

    async ngOnInit() {
      try {
        // Obtén los datos del usuario
        const userDataObservable = await this.authService.getUserData();
        if (userDataObservable) {
          userDataObservable.subscribe((data) => {
            this.usuario = data;
            localStorage.setItem('Nombre', this.usuario.nombre);
            console.log('Datos del usuario:', this.usuario);
          });
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    }

    // Función para manejar el cambio de imagen
    onFileChange(event: any) {
      if (event.target.files.length > 0) {
        this.profilePic = event.target.files[0];
      }
    }

    // Función para guardar la imagen de perfil
    async guardarfotoperfil() {
      if (this.profilePic) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const storage = getStorage();
          const filePath = `profilePictures/${user.uid}`;
          const fileRef = ref(storage, filePath);
    
          // Sube la imagen a Firebase Storage
          await uploadBytes(fileRef, this.profilePic);
    
          // Obtiene la URL de descarga
          const photoURL = await getDownloadURL(fileRef);
    
          // Actualiza Firestore con la URL de la nueva foto de perfil
          await this.actualizarfotoperfil(photoURL);
          alert("Foto de perfil actualizada correctamente.");
        } else {
          alert("No hay un usuario autenticado.");
        }
      } else {
        alert("Por favor selecciona una imagen primero.");
      }
    }
    

    // Función para actualizar la URL en Firestore
    private async actualizarfotoperfil(photoURL: string) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(this.firestore, `users/${user.uid}`);
        await updateDoc(userDoc, { photoURL });
      } else {
        console.error("No hay un usuario autenticado.");
      }
    }
    
  }
  

  

  
  
  
  
  
  
  


