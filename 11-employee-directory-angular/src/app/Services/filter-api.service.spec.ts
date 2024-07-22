import { TestBed } from '@angular/core/testing';

import { FilterApiService } from './filter-api.service';

describe('FilterApiService', () => {
  let service: FilterApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
