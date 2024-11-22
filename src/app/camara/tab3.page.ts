import { Component} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VisionService } from '../services/vision.service';
import { RegistrarService } from '../services/registrar.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page {
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  imageBase64: string = '';
  extractedText: string = ''; // Para almacenar el texto extraído
  isLoading: boolean = false; // Indicador de carga
  extractedFields: {
    nombrePaciente: string;
    direccion: string;
    veterinario: string;
    fecha: string;
    motivo: string;
  } | null = null;

  constructor(
    private visionService: VisionService,
    private firebaseService: RegistrarService,
    private alertController: AlertController
  ) {}

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
            motivo: this.extractField(fullAnnotation, /Motivo:\s*([^\n]+)/i),
            nombrePaciente: this.extractField(fullAnnotation, /Mascota:\s*([^\n]+)/i),
          };
          console.log('Nombre Paciente:', this.extractedFields.nombrePaciente);
          console.log('Dirección:', this.extractedFields.direccion);
          console.log('Veterinario:', this.extractedFields.veterinario);
          console.log('Fecha:', this.extractedFields.fecha);
          console.log('Motivo:', this.extractedFields.motivo);
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

async saveData() {
  try {
    await this.firebaseService.guardarDatosenColeccion('Recetas', this.extractedFields);
    await this.showAlert('Guardado exitoso', 'Los datos han sido guardados correctamente.');
  } catch (error) {
    console.error('Error al guardar:', error);
    await this.showAlert('Error', 'Hubo un problema al guardar los datos.');
  }
}

async showAlert(header: string, message: string) {
  const alert = await this.alertController.create({
    header,
    message,
    buttons: ['OK'],
  });
  await alert.present();
}

}
