import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTaskMessageComponent } from './no-task-message.component';

describe('NoTaskMessageComponent', () => {
  let component: NoTaskMessageComponent;
  let fixture: ComponentFixture<NoTaskMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoTaskMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoTaskMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
