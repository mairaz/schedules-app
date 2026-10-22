import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySchedulePage } from './my-schedule-page';

describe('MySchedulePage', () => {
  let component: MySchedulePage;
  let fixture: ComponentFixture<MySchedulePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySchedulePage],
    }).compileComponents();

    fixture = TestBed.createComponent(MySchedulePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
