import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisionService {
  public extractedText: string = '';
  private visionApiUrl: string = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCN7f8FKjm-3gNmTjO-S-knjre64YJBbkw';

  constructor(
    private http: HttpClient
  ) { }

  analyzeImage(imageBase64: string): Observable<any> {
    
    const request = {
      requests: [
        {
          image: {
            content: imageBase64,  // Imagen en Base64
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',  // OCR avanzado para formularios
            },
          ],
        },
      ],
    };
  
    // Llamada a la API de Google Cloud Vision
    this.http.post(this.visionApiUrl, request).subscribe(
      (response: any) => {
        const fullAnnotation = response.responses[0].fullTextAnnotation;
        if (fullAnnotation) {
          // Extraer el texto completo del formulario
          this.extractedText = fullAnnotation.text || 'No se encontró texto';
          
          // Procesar los bloques del formulario (parsing)
          const pages = fullAnnotation.pages;
          pages.forEach((page: any) => {
            page.blocks.forEach((block: any) => {
              console.log('Bloque de texto detectado:', block);
              block.paragraphs.forEach((paragraph: any) => {
                paragraph.words.forEach((word: any) => {
                  const text = word.symbols.map((symbol: any) => symbol.text).join('');
                  console.log('Palabra:', text);
                });
              });
            });
          });
          
        } else {
          this.extractedText = 'No se encontró texto';
        }
      },
      (error) => {
        console.error('Error en Vision API:', error);
      }
    );
    return this.http.post<any>(this.visionApiUrl, request);
  }
}
