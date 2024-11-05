import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showToolbar = true;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.router.events.subscribe((event: any) => {
      if (event.url === '/login') {
        this.showToolbar = false;
      } else {
        this.showToolbar = true;
      }
    });
  }

  ngOnInit() {
    
  }
}
