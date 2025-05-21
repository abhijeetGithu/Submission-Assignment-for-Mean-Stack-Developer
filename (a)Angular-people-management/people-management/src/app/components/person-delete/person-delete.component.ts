import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person-delete',
  templateUrl: './person-delete.component.html',
  styleUrls: ['./person-delete.component.scss']
})
export class PersonDeleteComponent implements OnInit, OnDestroy {
  personId: number = 0;
  person: Person | null = null;
  loading = false;
  error = '';
  deleting = false;
  confirmationInput = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService
  ) {}

  ngOnInit(): void {
    this.personId = +this.route.snapshot.params['id'];
    if (this.personId) {
      this.loadPerson();
    } else {
      this.router.navigate(['/people']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPerson(): void {
    this.loading = true;
    this.error = '';
    
    this.peopleService.getPerson(this.personId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (person) => {
          this.person = person;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'Error loading person details';
          this.loading = false;
          this.router.navigate(['/people']);
        }
      });
  }

  isConfirmationValid(): boolean {
    return this.confirmationInput.toLowerCase() === 'delete';
  }

  confirmDelete(): void {
    if (!this.isConfirmationValid()) {
      this.error = 'Please type "delete" to confirm';
      return;
    }

    this.deleting = true;
    this.error = '';
    
    this.peopleService.deletePerson(this.personId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/people']);
        },
        error: (error) => {
          this.error = error.message || 'Error deleting person';
          this.deleting = false;
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/people']);
  }
}