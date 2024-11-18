import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  Titulo: string = '';
  Lugar: string = '';
  Nota: string = '';
  Fechainicio: string = '';
  Fechafin: string = '';

  constructor(private firestoreService: AuthService) {
    
  }


}
