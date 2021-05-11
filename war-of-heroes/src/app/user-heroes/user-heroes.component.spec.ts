import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHeroesComponent } from './user-heroes.component';

describe('UserHeroesComponent', () => {
  let component: UserHeroesComponent;
  let fixture: ComponentFixture<UserHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHeroesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
