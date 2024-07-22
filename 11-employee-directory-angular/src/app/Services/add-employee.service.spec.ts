import { TestBed } from '@angular/core/testing';

import { AddEmployeeAndRoleService } from './add-employee.service';

describe('AddEmployeeApiService', () => {
  let service: AddEmployeeAndRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddEmployeeAndRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
