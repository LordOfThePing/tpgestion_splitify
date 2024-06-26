/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeGroupNameDialogComponent } from './changeGroupNameDialog.component';


describe('ChangeGroupNameDialogComponent', () => {
  let component: ChangeGroupNameDialogComponent;
  let fixture: ComponentFixture<ChangeGroupNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeGroupNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeGroupNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
