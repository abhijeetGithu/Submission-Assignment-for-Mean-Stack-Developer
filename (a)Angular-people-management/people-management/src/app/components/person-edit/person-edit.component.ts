import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Person } from '../../models/person.model';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements OnInit, OnDestroy {
  personForm: FormGroup;
  personId: number = 0;
  isNewPerson = false;
  submitted = false;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService
  ) {
    this.personForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.personId = +this.route.snapshot.params['id'];
    this.isNewPerson = !this.personId;

    if (!this.isNewPerson) {
      this.loadPersonDetails();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPersonDetails(): void {
    this.loading = true;
    this.error = '';
    
    this.peopleService.getPerson(this.personId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (person) => {
          this.personForm.patchValue({
            name: person.name,
            email: person.email,
            phone: person.phone
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'Error loading person details';
          this.loading = false;
          this.router.navigate(['/people']);
        }
      });
  }

  // Getter for easy access to form fields
  get f() { return this.personForm.controls; }

  getErrorMessage(fieldName: string): string {
    const control = this.f[fieldName];
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['email']) return 'Invalid email address';
    if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['pattern']) {
      switch(fieldName) {
        case 'email': return 'Invalid email format';
        case 'phone': return 'Phone number must be 10 digits';
        default: return 'Invalid format';
      }
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.personForm.invalid) {
      return;
    }

    this.loading = true;
    const personData: Person = {
      id: this.isNewPerson ? 0 : this.personId,
      name: this.f['name'].value.trim(),
      email: this.f['email'].value.trim().toLowerCase(),
      phone: this.f['phone'].value.trim()
    };

    const request$ = this.isNewPerson ?
      this.peopleService.addPerson(personData) :
      this.peopleService.updatePerson(personData);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/people']);
        },
        error: (error) => {
          this.error = error.message || `Error ${this.isNewPerson ? 'adding' : 'updating'} person`;
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/people']);
  }
}