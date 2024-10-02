import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showToolbar = true;

  constructor(private router: Router) {
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
