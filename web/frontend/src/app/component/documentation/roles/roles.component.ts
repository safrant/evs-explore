import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from './../../../service/configuration.service';

// Documentation roles component
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles: any;
  terminology: string = null;

  constructor(
    private configService: ConfigurationService
  ) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getRoles(this.terminology)
      .subscribe(response => {
        this.roles = response;
        this.roles.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      if (value1 == undefined)
        return 0;
      return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
