import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExpenditureDialogComponent } from './deleteExpenditureDialog.component';

describe('DeleteExpenditureDialogComponent', () => {
  let component: DeleteExpenditureDialogComponent;
  let fixture: ComponentFixture<DeleteExpenditureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteExpenditureDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteExpenditureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
