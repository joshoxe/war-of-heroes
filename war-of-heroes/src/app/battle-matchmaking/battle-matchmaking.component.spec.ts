import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMatchmakingComponent } from './battle-matchmaking.component';

describe('BattleMatchmakingComponent', () => {
  let component: BattleMatchmakingComponent;
  let fixture: ComponentFixture<BattleMatchmakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleMatchmakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMatchmakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
