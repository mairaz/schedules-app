import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapList } from './swap-list';

describe('SwapList', () => {
  let component: SwapList;
  let fixture: ComponentFixture<SwapList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapList],
    }).compileComponents();

    fixture = TestBed.createComponent(SwapList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
