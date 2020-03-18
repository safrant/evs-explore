import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';

// Configuration service
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  static propertyList = null;
  static evsVersionInfo = null;
  static fullSynSources = null;
  private static instance: ConfigurationService = null;

  // Return the instance of the service
  public static getInstance(injector: Injector, http: HttpClient, notificationService: NotificationService): ConfigurationService {
    if (ConfigurationService.instance === null) {
      ConfigurationService.instance = new ConfigurationService(injector, http, notificationService);
    }
    return ConfigurationService.instance;
  }

  constructor(private injector: Injector, private http: HttpClient, private notificationService: NotificationService) {
  }

  // Load configuration
  loadConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('/api/v1/metadata').toPromise()
        .then(response => {
          ConfigurationService.propertyList = response['properties'];
          ConfigurationService.evsVersionInfo = response['evsVersionInfo'];
          ConfigurationService.fullSynSources = response['fullSynSources'];
          resolve(true);
        }).catch(error => {
          resolve(false);
        });
    });
  }
}
