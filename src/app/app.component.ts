import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="layout-container">
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'e-commerce-client';
}
