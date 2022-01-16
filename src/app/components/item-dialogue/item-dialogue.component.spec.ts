import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDialogueComponent } from './item-dialogue.component';

describe('ItemDialogueComponent', () => {
  let component: ItemDialogueComponent;
  let fixture: ComponentFixture<ItemDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
