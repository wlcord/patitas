import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  allDocuments: any[] = [];

  constructor(private firestoreService: AuthService) {
    
  }

  async perfiles() {
    this.allDocuments = await this.firestoreService.obtenerdatos('Dueño_Mascota');
    console.log(this.allDocuments);
  }
}
