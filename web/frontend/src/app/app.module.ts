// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
// import { Injector, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split'

// Facebook modules
import { FacebookModule } from 'ngx-facebook';

// Primeng Modules, Services
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ChipsModule } from 'primeng/chips';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { ToggleButtonModule } from 'primeng/togglebutton';

// ngx
import { NgxSpinnerModule } from 'ngx-spinner';
import { GeneralSearchComponent } from './component/general-search/general-search.component';
import { ConceptDetailComponent } from './component/concept-detail/concept-detail.component';
import { ConceptRelationshipComponent } from './component/concept-relationship/concept-relationship.component';
import { ConceptDisplayComponent } from './component/concept-display/concept-display.component';
import { HierarchyDisplayComponent } from './component/hierarchy-display/hierarchy-display.component';
import { SubsetsComponent } from './component/subsets/subsets.component';
import { MappingsComponent } from './component/mappings/mappings.component';
import { AssociationsComponent } from './component/documentation/associations/associations.component';
import { PropertiesComponent } from './component/documentation/properties/properties.component';
import { QualifiersComponent } from './component/documentation/qualifiers/qualifiers.component';
import { OverviewComponent } from './component/documentation/overview/overview.component';
import { RolesComponent } from './component/documentation/roles/roles.component';
import { DefinitionTypesComponent } from './component/documentation/definition-types/definition-types.component';
import { SynonymTypesComponent } from './component/documentation/synonym-types/synonym-types.component';
import { TermTypesComponent } from './component/documentation/term-types/term-types.component';
import { SourcesComponent } from './component/documentation/sources/sources.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { AlldocsComponent } from './component/documentation/alldocs/alldocs.component';
import { SubsetDetailsComponent } from './component/subset-details/subset-details.component';
import { SubsetNcitComponent } from './component/documentation/subset-ncit/subset-ncit.component';

// Local Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Local components
import { NotificationComponent } from './component/notifications/notifications.component';
import { ErrorComponent } from './component/error/error.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { EvsHeaderComponent } from './component/evs-header/evs-header.component';
import { EvsFooterComponent } from './component/evs-footer/evs-footer.component';
import { LoaderComponent } from './component/loader/loader.component';

// pipes
// BAC - looks like not used
import { DisplayPipe } from './service/display.pipe';

// Local services
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigurationService } from './service/configuration.service';
import { GlobalErrorHandler } from './service/global-error-handler.service';
import { NotificationService } from './service/notification.service';
import { CommonDataService } from './service/common-data.service';
import { LoadingInterceptor } from './service/loading-interceptor.service';
import { LoaderService } from './service/loader.service';
import { ConceptDetailService } from './service/concept-detail.service';
import { SearchTermService } from './service/search-term.service';

// NGB
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutofocusDirective } from './directive/autofocus/autofocus.directive';

// Cookies
import { CookieService } from 'ngx-cookie-service';
import { ContactUsComponent } from './component/contact-us/contact-us.component';

// Angular configuration for this application
@NgModule({
  declarations: [
    AppComponent,
    EvsHeaderComponent,
    EvsFooterComponent,
    NotificationComponent,
    ErrorComponent,
    PageNotFoundComponent,
    LoaderComponent,
    DisplayPipe,
    GeneralSearchComponent,
    ConceptDetailComponent,
    ConceptRelationshipComponent,
    ConceptDisplayComponent,
    HierarchyDisplayComponent,
    SubsetsComponent,
    MappingsComponent,
    AssociationsComponent,
    PropertiesComponent,
    QualifiersComponent,
    OverviewComponent,
    RolesComponent,
    DefinitionTypesComponent,
    SynonymTypesComponent,
    TermTypesComponent,
    SourcesComponent,
    WelcomeComponent,
    AutofocusDirective,
    ContactUsComponent,
    AlldocsComponent,
    ContactUsComponent,
    SubsetDetailsComponent,
    SubsetNcitComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FacebookModule.forRoot(),
    MessagesModule,
    MessageModule,
    HttpClientModule,
    FormsModule,
    BlockUIModule,
    NgxSpinnerModule,
    ToastModule,
    MultiSelectModule,
    PanelModule,
    AutoCompleteModule,
    ButtonModule,
    RadioButtonModule,
    ChipsModule,
    TooltipModule,
    ToolbarModule,
    TableModule,
    TabViewModule,
    TreeTableModule,
    DropdownModule,
    ToggleButtonModule,
    AngularSplitModule.forRoot()
  ],
  exports: [
    NotificationComponent,
    DisplayPipe
  ],
  providers: [
    CookieService,
    NotificationService,
    CommonDataService,
    MessageService,
    LoaderService,
    ConceptDetailService,
    ConceptDisplayComponent,
    SearchTermService,
    GlobalErrorHandler,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigurationService) => function () {
        return configService.loadConfig();
      },
      deps: [ConfigurationService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})

// Export this module
export class AppModule { }
