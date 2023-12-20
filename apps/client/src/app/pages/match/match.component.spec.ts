import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchComponent } from './match.component';
import { MatchService } from 'src/app/services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, last, of } from 'rxjs';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { DeskComponent } from './components/desk/desk.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarComponent } from 'src/app/components/avatar/avatar.component';

describe('MatchComponent', () => {
  let component: MatchComponent;
  let fixture: ComponentFixture<MatchComponent>;
  let store: jasmine.SpyObj<Store>;
  let matchService: jasmine.SpyObj<MatchService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'joinMatch',
      'createMatch',
      'cardDeck$',
      'getSpectators',
    ]) as jasmine.SpyObj<MatchService>;

    serviceSpy.getSpectators.and.returnValue(
      of([{ name: 'hey', id: "" }, { name: 'whats', id: "" }, { name: 'up', id: "" }, { name: 'bro', id: "" }])
    );

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    storeSpy.select.and.callFake(() => EMPTY);
    serviceSpy.cardDeck$.and.callFake(() => EMPTY);

    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    routeSpy.snapshot = {
      paramMap: {
        get: () => '1',
      },
    };

    TestBed.configureTestingModule({
      declarations: [
        MatchComponent,
        JoinDialogComponent,
        MatchComponent,
        DeskComponent,
        InviteDialogComponent,
        CardDeckComponent,
      ],
      imports: [
        ButtonComponent,
        DialogComponent,
        ReactiveFormsModule,
        AvatarComponent,
      ],
      providers: [
        { provide: MatchService, useValue: serviceSpy },
        { provide: Store, useValue: storeSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    });
    fixture = TestBed.createComponent(MatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    matchService = TestBed.inject(MatchService) as jasmine.SpyObj<MatchService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a list of three spectators', (done) => {
    component.spectators$.subscribe((spectators) => {
      expect(spectators.length).toBe(3);
      done();
    });
  });

  it('should return a spectator count', (done) => {
    component.spectatorsCount$.pipe(last()).subscribe((count) => {
      expect(count).toBe(4);
      done();
    });
  });

  it('should return a spectator count label', () => {
    expect(component.spectatorCountLabel).toBe('1+');
  });

  it('should handle user choose', () => {
    component.handleUserChoose({ name: 'hey', mode: 'single' });
    expect(component.isUserChosed).toBeTrue();
    expect(matchService.joinMatch).toHaveBeenCalled();
  });

  it('should handle invite modal open', () => {
    component.handleInviteModalOpen();
    expect(component.isInviteModalOpen).toBeTrue();
  });

  it('should handle invite modal close', () => {
    component.handleInviteModalClose();
    expect(component.isInviteModalOpen).toBeFalse();
  });

  it('should return a name', () => {
    store.select.and.returnValue(of({ match: { name: 'hey', k: 'v' } }));
    expect(component.name$).toBeTruthy();
  });
});
