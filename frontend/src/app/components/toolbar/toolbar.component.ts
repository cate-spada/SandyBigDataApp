import { Component} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  constructor() { }

  links = ['/homepage', '/tweet', '/map', '/number', '/clustering'];
  titles = ['Home', 'Tweet', 'Map', 'Number', 'Clustering'];
  activeLink = this.links[1];

}
