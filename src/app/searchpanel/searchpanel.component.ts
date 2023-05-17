import { Component } from '@angular/core';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-searchpanel',
  templateUrl: './searchpanel.component.html',
  styleUrls: ['./searchpanel.component.scss']
})
export class SearchpanelComponent {
  search = '';
  constructor(private helper: HelperService) {}
  searchItems() {
    setTimeout( () => {
      this.helper.searchItem(this.search)
    }, 500)

  }
}
