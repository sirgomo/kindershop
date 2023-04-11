import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
@ViewChild('menu', {static: true}) menu!: MatMenu;
isLogged = false;

login() {}
logout() {}
}
