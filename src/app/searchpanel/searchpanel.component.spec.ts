import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpanelComponent } from './searchpanel.component';

describe('SearchpanelComponent', () => {
  let component: SearchpanelComponent;
  let fixture: ComponentFixture<SearchpanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchpanelComponent]
    });
    fixture = TestBed.createComponent(SearchpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
