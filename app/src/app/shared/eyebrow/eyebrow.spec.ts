import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eyebrow } from './eyebrow';

describe('Eyebrow', () => {
  let component: Eyebrow;
  let fixture: ComponentFixture<Eyebrow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eyebrow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Eyebrow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
