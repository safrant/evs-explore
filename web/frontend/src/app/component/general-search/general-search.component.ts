import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurationService } from './../../service/configuration.service';
import { SearchCriteria } from './../../model/searchCriteria';
import { TableData } from './../../model/tableData';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { SearchResult } from './../../model/searchResult';
import { SearchResultTableFormat } from './../../model/searchResultTableFormat';
import { SearchTermService } from './../../service/search-term.service';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Router } from '@angular/router';

// Prior imports, now unused
// import { Inject, ElementRef } from '@angular/core';
// import { map } from 'rxjs/operators';
// import { DialogService } from 'primeng/api';
// import { MenuItem } from 'primeng/api';
// import { MatchedConcept } from './../../model/matchedConcept';
// import { Facet } from './../../model/Facet';
// import { FacetField } from './../../model/FacetField';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-general-search',
  templateUrl: './general-search.component.html',
  styleUrls: ['./general-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralSearchComponent implements OnInit,
  AfterViewInit {
  @ViewChild('dtSearch', { static: false }) public dtSearch: Table;
  @Input() welcomePage: boolean;
  @ViewChild('termauto', { static: false }) termauto: AutoComplete;

  // fields
  searchCriteria: SearchCriteria;
  searchResult: SearchResult;
  searchResultTableFormat: SearchResultTableFormat;
  title: string;
  loadedMultipleConcept = false;
  noMatchedConcepts = true;
  selectedSearchType: string;
  selectedSearchValues: string[] = [];
  termautosearch: string;
  oldTermautosearch: string;
  textSuggestions: string[] = [];
  biomarkers: string[] = [];
  selectedConceptCode: string;
  displayDetail = false;
  // TODO: VERY NCIt specific
  selectedPropertiesReturn: string[] = ['Preferred_Name', 'FULL_SYN', 'DEFINITION'];
  displayText = false;
  displayTableFormat = true;
  avoidLazyLoading = true;
  showMoreSearchOption = false;

  // Table
  cols: any[];
  colsOrig: any[];
  multiSelectCols: any[];
  selectedColumns: any[];
  displayColumns: any[];
  columnMore = true;
  reportData: TableData[];
  selectRows: TableData[];
  pageinationcount: string;
  pageSize = 10;

  // page parameters
  currentPage = 1;

  selectedPropertiesSearch: string[] = [];
  propertiesReturn = null;
  hitsFound = 0;
  timetaken = '';
  loading: boolean;
  showMore = true;

  // filter for sources
  selectedSource: string[] = [];
  sourcesAll = null;

  // get the parameters for the search
  constructor(private searchTermService: SearchTermService,
    private conceptDetailService: ConceptDetailService,
    private route: ActivatedRoute, public router: Router) {

    this.searchCriteria = new SearchCriteria();

    // TODO: re-enable this?
    // this.searchCriteria.term = route.snapshot.params['term'];
    // this.searchCriteria.type = route.snapshot.params['type'];
    // this.searchCriteria.property = route.snapshot.params['property'];

    console.log('window location = ', window.location.pathname);
    const path = '' + window.location.pathname;
    if (path.includes('welcome')) {
      this.welcomePage = true;
    } else {
      this.welcomePage = false;
    }

    // Set up defaults in session storage if welcome page
    if (this.welcomePage) {
      sessionStorage.setItem('searchType', 'contains');
      this.selectedSearchType = 'contains';
    }
    // Otherwise, recover search type from session storage
    else {
      if (this.selectedSearchType === null || this.selectedSearchType === undefined) {
        if ((sessionStorage.getItem('searchType') !== null) && (sessionStorage.getItem('searchType') !== undefined)) {
          this.selectedSearchType = sessionStorage.getItem('searchType');
        } else {
          this.selectedSearchType = 'contains';
        }
      }
    }

    // Show more search options depending on search type
    if (this.selectedSearchType === 'phrase' ||
      this.selectedSearchType === 'fuzzy' ||
      this.selectedSearchType === 'AND' ||
      this.selectedSearchType === 'OR'
    ) {
      this.showMoreSearchOption = true;
    }

    // Set paging parameters
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.pageSize;

    // Populate sources list from application metadata
    this.sourcesAll = ConfigurationService.fullSynSources.map(element => {
      return {
        label: element,
        value: element
      };
    });

    // Set default selected source if on welcome page
    if (this.welcomePage) {
      this.selectedSource = [];
      sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
      this.termautosearch = '';
      this.oldTermautosearch = '';
      sessionStorage.setItem('searchTerm', this.termautosearch);
    }
    // Otherwise, recover from session storage
    else {
      console.log('  re-perform search');
      if ((sessionStorage.getItem('source') !== null) && (sessionStorage.getItem('source') !== undefined)) {
        const sources = sessionStorage.getItem('source');
        this.selectedSource = JSON.parse(sources);
        this.termautosearch = sessionStorage.getItem('searchTerm');
        this.performSearch(sessionStorage.getItem('searchTerm'));
      } else if ((sessionStorage.getItem('searchTerm') !== null) && (sessionStorage.getItem('searchTerm') !== undefined)) {
        this.termautosearch = sessionStorage.getItem('searchTerm');
        this.performSearch(sessionStorage.getItem('searchTerm'));
      }
    }

  }

  // On init, print console message
  ngOnInit() {
    console.log('search component initialized');
  }

  // Send focus to the search field
  ngAfterViewInit() {
    console.log('set input focus');
    setTimeout(() => this.termauto.focusInput());
  }

  // Toggle the show more details
  toggleShowMoreDetails() {
    console.log('toggleShowMoreDetails');
    if (this.showMore) {
      this.showMore = false;
    } else {
      this.showMore = true;
    }
  }

  // Toggle setting for more search options
  toggleShowMoreSearchOptions() {
    console.log('toggleShowMoreSearchOptions');
    if (this.showMoreSearchOption) {
      this.showMoreSearchOption = false;
    } else {
      this.showMoreSearchOption = true;
    }
  }

  // Clear search text, update session storage
  clearSearchText(event) {
    console.log('clear search text');
    this.termautosearch = '';
    this.oldTermautosearch = '';
    sessionStorage.setItem('searchTerm', this.termautosearch);
  }

  // Reset paging
  resetPaging() {
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.pageSize;
  }

  // Reset source
  resetSource() {
    console.log('resetSource');
    this.selectedSource = [];
    this.performSearch(this.termautosearch);
  }

  // Reset filters and search type
  resetFilters(event) {
    console.log('resetFilters');
    this.selectedPropertiesReturn = ['Preferred_Name', 'FULL_SYN', 'DEFINITION'];
    this.selectedSearchType = 'contains';
    sessionStorage.setItem('searchType', this.selectedSearchType);
    this.selectedSource = [];
    sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
    console.log('reset filters', this.selectedPropertiesReturn, this.selectedSearchType, this.selectedSource);
  }

  // Reset the search table
  resetTable() {
    console.log('resetTable');
    this.resetPaging();
    if (this.dtSearch !== null && this.dtSearch !== undefined) {
      this.dtSearch.reset();
    }
  }

  // Handle a paging event in the table
  onPageChange(event) {
    console.log('onPageChange', event);
    const fromRecord = (event - 1) * this.pageSize;
    this.searchCriteria.fromRecord = fromRecord;
    this.searchCriteria.pageSize = this.pageSize;
    this.performSearch(this.termautosearch);
  }

  // Handle a key event with "backspace" or "delete"
  onChipsKeyEvent(event) {
    console.log('onChipsKeyEvent', event);
    if (!(event.keyCode === 8 || event.keyCode === 46)) {
      return false;
    }

  }

  // Handle search type changing
  changeSearchType(event) {
    console.log('changeSearchType', event);
    this.currentPage = 1;
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.pageSize;
    this.selectedSearchType = event;
    sessionStorage.setItem('searchType', this.selectedSearchType);
    this.performSearch(this.termautosearch);
  }

  // Perform search
  search(event) {
    console.log('window location (search) = ', window.location.pathname);
    const path = '' + window.location.pathname;

    // Navigate from welcome page
    if (path.includes('welcome')) {
      sessionStorage.setItem('searchTerm', event.query);
      this.router.navigate(['/search']);
    }
    //
    else {
      this.avoidLazyLoading = true;

      if (this.dtSearch !== null && this.dtSearch !== undefined) {
        this.dtSearch.reset();
        this.searchCriteria.fromRecord = 0;
        // TODO: this is not ideal, the page size should be controlled by a service
        this.searchCriteria.pageSize = this.dtSearch.rows;
      }

      // Save query in session storage and perform search
      if (event.query !== this.oldTermautosearch) {
        this.oldTermautosearch = event.query;
        sessionStorage.setItem('searchTerm', event.query);
        this.performSearch(event.query);
      }
      // Handle case where the search query text didnt change
      else {
        this.textSuggestions = [];
        this.loading = false;
      }
    }

  }

  // Handle autocomplete
  onSelectSuggest() {
    console.log('suggestTerm', this.termautosearch);
    this.performSearch(this.termautosearch);
  }

  // Handle clearing autocomplete
  clearResults() {
    console.log('clearResults');
    this.noMatchedConcepts = true;
    this.loadedMultipleConcept = false;
  }

  // TODO: is this used?
  // get the results based on the parameters
  onSubmitSearch() {
    console.log('onSubmitSearch', this.termautosearch);
    this.currentPage = 1;
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.dtSearch.rows;
    this.performSearch(this.termautosearch);
  }

  // Handle a change of the source - save in session storage and re-search
  onChangeSource(event) {
    console.log("onChangeSource");
    sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
    this.performSearch(this.termautosearch);
  }

  // Handle deselecting a source
  onSourceSelectDeselect(event) {
    console.log('onSourceSelectDeselect', event, this.selectedSource);
    sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
    this.performSearch(this.termautosearch);
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    console.log('onLazyLoadData', this.avoidLazyLoading, event);
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const fromRecord = event.first;
      this.searchCriteria.fromRecord = fromRecord;
      this.searchCriteria.pageSize = event.rows;
      this.performSearch(this.termautosearch);
    }
  }

  // Handler for clicking the "Search" button
  onPerformSearch() {
    console.log('onPerformSearch', this.termautosearch);
    this.resetTable();
    this.performSearch(this.termautosearch);
  }

  // Set columns
  setColumns() {
    this.displayColumns = [...this.cols.filter(a => this.selectedColumns.includes(a.header))];
  }

  // Perform the search
  performSearch(term) {
    console.log('perform search', term);

    // Configure search criteria
    this.searchCriteria.term = term;
    this.searchCriteria.definitionSource = null;
    this.searchCriteria.synonymSource = null;
    this.searchCriteria.synonymTermGroup = null;
    // this.searchCriteria.hierarchySearch = null;

    if (this.selectedPropertiesSearch !== null && this.selectedPropertiesSearch !== undefined
      && this.selectedPropertiesSearch.length > 0) {
      this.searchCriteria.property = this.selectedPropertiesSearch;
    } else {
      this.searchCriteria.property = ['full_syn', 'code', 'preferred_name'];
    }

    this.searchCriteria.contributingSource = this.selectedSource;
    this.searchCriteria.type = this.selectedSearchType;
    this.loading = true;
    if (this.searchCriteria.term !== undefined && this.searchCriteria.term != null && this.searchCriteria.term !== '') {
      // Remove tabs and quotes from search term
      this.searchCriteria.term = String(this.searchCriteria.term).replace('\t', '');
      this.searchCriteria.term = String(this.searchCriteria.term).replace(/\"/g, '');
      // call search term service
      this
        .searchTermService
        .search(this.searchCriteria)
        .subscribe(response => {
          console.log('  search result = ', response);

          // Build the search results table
          this.searchResultTableFormat = new SearchResultTableFormat(
            new SearchResult(response), this.selectedPropertiesReturn.slice());

          this.hitsFound = this.searchResultTableFormat.total;
          this.timetaken = this.searchResultTableFormat.timeTaken;

          if (this.hitsFound > 0) {
            this.title = 'Found ' + this.hitsFound + ' concepts in ' + this.timetaken + ' ms';
            this.cols = [...this.searchResultTableFormat.header];
            this.multiSelectCols = this.cols.map(element => {
              return {
                label: element.header,
                value: element.header
              };
            });
            this.setDefaultSelectedColumns();

            console.log('cols' + JSON.stringify(this.cols));
            this.colsOrig = [...this.searchResultTableFormat.header];
            this.reportData = [...this.searchResultTableFormat.data];

            this.displayTableFormat = true;
            this.loadedMultipleConcept = true;
            this.noMatchedConcepts = false;
          } else {
            this.noMatchedConcepts = true;
            this.loadedMultipleConcept = false;
          }

        });
    } else {
      this.loadedMultipleConcept = false;
      this.noMatchedConcepts = true;
      this.searchResult = new SearchResult({ 'total': 0 });
      this.reportData = [];
      this.displayTableFormat = false;

    }
    this.textSuggestions = [];
    this.loading = false;
  }

  // Set default selected columns
  setDefaultSelectedColumns() {
    console.log('setDefaultSelectedColumns');
    if (!this.columnMore) {
      this.displayColumns = this.cols.slice(0, 2);
      this.selectedColumns = this.displayColumns.map(element => element.header);
    } else {
      if (this.selectedColumns == null || this.selectedColumns == undefined || this.selectedColumns.length <= 0) {
        this.displayColumns = this.cols;
        this.selectedColumns = this.displayColumns.map(element => element.header);
      } else {
        this.displayColumns = [...this.cols.filter(a => this.selectedColumns.includes(a.header))];
      }
    }
  }

  // Set default columns
  setDefaultColumns() {
    console.log('setDefaultColumns');
    if (!this.columnMore) {
      this.displayColumns = this.cols.slice(0, 2);
    } else {
      this.displayColumns = this.cols;
    }
    this.selectedColumns = this.displayColumns.map(element => element.header);
  }

}
