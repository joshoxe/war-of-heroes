import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleGameComponent } from './battle-game.component';

describe('BattleGameComponent', () => {
  let component: BattleGameComponent;
  let fixture: ComponentFixture<BattleGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
