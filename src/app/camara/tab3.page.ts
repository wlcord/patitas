import { Component, OnInit} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VisionService } from '../services/vision.service';
import { RegistrarService } from '../services/registrar.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page   {
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  
  imageBase64: string = ''; // Para almacenar la imagen tomada por la camara
  extractedText: string = ''; // Para almacenar el texto completo extraído de la imagen
  isLoading: boolean = false; // Indicador de carga
  extractedFields!: {
    nombrePaciente: string;
    especie: string;
    raza: string;
    edad: string;
    peso: string;
    direccion: string;
    veterinario: string;
    fecha: string;
    diagnostico: string;
    rp: string;
  }; // Para almacenar los datos especificos extraidos de la imagen  

  constructor(
    private visionService: VisionService,
    private firebaseService: RegistrarService,
    private alertController: AlertController
  ) {}

  

  // Funcion que abre la camara del telefono para poder tomar las fotos y enviar la foto a la funcion de procesarImagen
  async tomarFoto() {
    try {
      // Capturar la foto con la cámara
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64, // Obtener la imagen como Base64
        source: CameraSource.Camera, // Usar la cámara directamente
      });

      if (image?.base64String) {
        // Procesar la imagen con Google Vision
        this.procesarImagen(image.base64String);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
    }
  }
  
  // Funcion que se dedica a procesar la imagen donde se extrae los datos dependiendo de los campos especificados como por ejemplo el nombre de paciente
  procesarImagen(imageBase64: string) {
    this.isLoading = true;
    this.visionService.analyzeImage(imageBase64).subscribe(
      (response: any) => {
        const fullAnnotation = response.responses[0]?.fullTextAnnotation?.text;
        console.log('Texto detectado por Vision API:', fullAnnotation);


        if (fullAnnotation) {
          // Extraer campos específicos
          this.extractedFields = {
            direccion: this.extractField(fullAnnotation, /Dirección:\s*([^\n]+)/i),
            veterinario: this.extractField(fullAnnotation, /Veterinario:\s*([^\n]+)/i),
            fecha: this.extractField(fullAnnotation, /Fecha:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i),
            diagnostico: this.extractField(fullAnnotation, /Diagnostico:\s*([^\n]+)/i),
            rp: this.extractField(fullAnnotation, /Rp.\s*([^\n]+)/i),
            nombrePaciente: this.extractField(fullAnnotation, /Nombre Paciente:\s*([^\n]+)/i),
            especie: this.extractField(fullAnnotation, /Especie:\s*([^\n]+)/i),
            raza: this.extractField(fullAnnotation, /Raza:\s*([^\n]+)/i),
            edad: this.extractField(fullAnnotation, /Edad:\s*([^\n]+)/i),
            peso: this.extractField(fullAnnotation, /Peso:\s*([^\n]+)/i),
  
          };
          console.log('Nombre Paciente:', this.extractedFields.nombrePaciente);
        } else {
          this.extractedText = 'No se encontró texto';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error en Vision API:', error);
        this.isLoading = false;
      }
    );
  }

// Método para usar expresiones regulares y obtener datos específicos
extractField(text: string, regex: RegExp): string {
  const match = text.match(regex);
  return match ? match[1] : 'No encontrado';
}

// Funcion para guardar los datos extraidos de la imgen en una coleccion en firerbase
async guardarDatos() {
  try {
    const rutUsuario = localStorage.getItem('Rut');
    const datosConRUT = { ...this.extractedFields, rut: rutUsuario };
    await this.firebaseService.guardarDatosenColeccion('Recetas', datosConRUT);
    await this.showAlert('Guardado exitoso', 'Los datos han sido guardados correctamente.');
  } catch (error) {
    console.error('Error al guardar:', error);
    await this.showAlert('Error', 'Hubo un problema al guardar los datos.');
  }
}

// Alerta para confirmar que los datso fueron guardados correctamente.
async showAlert(header: string, message: string) {
  const alert = await this.alertController.create({
    header,
    message,
    buttons: ['OK'],
  });
  await alert.present();
}

}
