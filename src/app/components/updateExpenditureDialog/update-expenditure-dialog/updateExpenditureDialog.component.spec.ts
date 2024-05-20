import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpenditureDialogComponent } from './updateExpenditureDialog.component';

describe('UpdateExpenditureDialogComponent', () => {
  let component: UpdateExpenditureDialogComponent;
  let fixture: ComponentFixture<UpdateExpenditureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateExpenditureDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateExpenditureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
