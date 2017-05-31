import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileItinerariesComponent } from './profile-itineraries.component';

describe('ProfileItinerariesComponent', () => {
  let component: ProfileItinerariesComponent;
  let fixture: ComponentFixture<ProfileItinerariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileItinerariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileItinerariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
