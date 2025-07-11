
# Full Stack Assignment - Angular + Node.js + MongoDB

## Overview

This repository contains solutions for both parts of the full stack assignment:

1. **Angular 7/8 Single Page Application (SPA)** – Manage a list of people using REST API.
2. **Node.js + MongoDB RESTful API** – Create and manage people records.

---

## 📘 Part (a): Angular 7/8 SPA

### Description

A single-page Angular application that interacts with a RESTful API to:

- List all people
- Edit a person
- Delete a person

### Technologies

- Angular 7/8
- Angular CLI
- Bootstrap 4 (optional for UI)
- RxJS
- HttpClient

### REST API Used

Sample REST API from JavaSampleApproach:
```
GET     http://localhost:8080/SpringBootRestApi/api/users
GET     http://localhost:8080/SpringBootRestApi/api/users/{id}
PUT     http://localhost:8080/SpringBootRestApi/api/users/{id}
DELETE  http://localhost:8080/SpringBootRestApi/api/users/{id}
```

### Setup Instructions

```bash
# Install Angular CLI (if not installed)
npm install -g @angular/cli@8

# Clone the repository
git clone https://github.com/abhijeetGithu/Submission-Assignment-for-Mean-Stack-Developer.git
cd (a)Angular-people-management/people-management

# Install dependencies
npm install

# Run the app
ng serve

# Access in browser
http://localhost:4200
```

### Screens

- `/people` – View all people
- `/people/edit/:id` – Edit a person
- `/people/delete/:id` – Delete a person

---

## 📗 Part (b): Node.js + MongoDB REST API

### Description

A RESTful API built with Node.js and MongoDB to store and manage people records.

### Endpoints

```http
GET     /person            # List all people
POST    /person            # Create a new person
PUT     /person/:id        # Edit an existing person
DELETE  /person/:id        # Delete a person
```
