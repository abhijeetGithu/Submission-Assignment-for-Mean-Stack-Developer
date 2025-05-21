import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Person } from '../../models/person.model';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit, OnDestroy {
  people: Person[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  itemsPerPage = 10;
  private destroy$ = new Subject<void>();

  constructor(
    private peopleService: PeopleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPeople(): void {
    this.loading = true;
    this.error = '';
    
    this.peopleService.getPeople(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.people = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'Error loading people';
          this.loading = false;
        }
      });
  }

  editPerson(id: number): void {
    if (this.loading) return;
    this.router.navigate(['/people/edit', id]);
  }

  deletePerson(id: number): void {
    if (this.loading) return;
    this.router.navigate(['/people/delete', id]);
  }

  addPerson(): void {
    if (this.loading) return;
    this.router.navigate(['/people/add']);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPeople();
  }
}
