import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectshowComponent } from './projectshow.component';

describe('ProjectshowComponent', () => {
  let component: ProjectshowComponent;
  let fixture: ComponentFixture<ProjectshowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectshowComponent]
    });
    fixture = TestBed.createComponent(ProjectshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
