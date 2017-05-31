import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCountryVisitComponent } from './profile-country-visit.component';

describe('ProfileCountryVisitComponent', () => {
  let component: ProfileCountryVisitComponent;
  let fixture: ComponentFixture<ProfileCountryVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCountryVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCountryVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
