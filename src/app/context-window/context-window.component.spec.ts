import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextWindowComponent } from './context-window.component';

describe('ContextWindowComponent', () => {
  let component: ContextWindowComponent;
  let fixture: ComponentFixture<ContextWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
