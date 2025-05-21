import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Person } from '../models/person.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private apiUrl = environment.apiUrl + '/users';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Get all people with pagination
  getPeople(page: number = 1, perPage: number = 10): Observable<Person[]> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', perPage.toString());

    return this.http.get<Person[]>(this.apiUrl, { params })
      .pipe(
        retry(2),
        map(users => users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }))),
        catchError(this.handleError)
      );
  }

  // Get a single person by ID
  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Add a new person
  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing person
  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a person
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}