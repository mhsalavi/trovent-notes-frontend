# Trovent Notes Frontend

This project is a Vue 3-based frontend application that interacts with the [Trovent Notes REST API backend](https://github.com/trovent/notes-api). It allows users to create, edit, view, and delete notes with input validation, and modal previews.

## Features

- Fully responsive user interface built with Tailwind CSS and SCSS.
- Create, update, delete, and view notes.
- Search and sorting functionality.
- Input validation with inline error messages.
- Icons for actions (view, edit, delete).
- Scrollable list section with styled scrollbar.

## Project Structure

- `NoteForm.vue`: Form component to add/edit a note.
- `NoteList.vue`: Renders list of notes with actions.
- `HomeView.vue`: Main view handling layout, search/sort logic, and modals.
- `style.scss`: Contains Tailwind imports and SCSS styling variables.

## Setup Instructions

### 1. Clone and Navigate

```bash
git clone https://github.com/mhsalavi/trovent-notes-frontend.git
cd trovent-notes-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app should now be running on [http://localhost:3000](http://localhost:3000)

### 4. API Backend

Make sure the [Trovent Notes API](https://github.com/trovent/notes-api) backend is running on [http://localhost:8000](http://localhost:8000).

## Testing

This project uses [Vitest](https://vitest.dev/) and [@vue/test-utils](https://test-utils.vuejs.org/) for unit testing.

To run all unit tests, use:

```bash
npm run test
```

### Test Coverage

The following components are covered with unit tests:

- **NoteForm.vue**

  - Validation for title, content, category, and due date.
  - Form reset after successful submission.
  - Pre-filling form fields in edit mode.
  - Graceful error handling on failed save.

- **NoteList.vue**

  - Emits `view-note`, `edit-note`, and `note-deleted` events.
  - Renders list of notes and empty state correctly.
  - Conditionally renders icons via Lucide.

Test files are located in the `src/tests/` directory.

## Docker Integration

This frontend is containerized with Docker and integrated with the backend using `docker-compose`.

To run the project inside a Docker container, follow these steps:

1. **Install Docker**  
   Ensure that [Docker](https://docs.docker.com/get-docker/) is installed on your system.

2. **Navigate to the project directory**  
   Move to the directory where the `docker-compose.yml` file is located:
   ```bash
   cd path/to/your/project
   ```

## Validation

- Input fields are validated with RegEx to avoid injection or malformed input.
- Errors are shown inline under the relevant field.
- Unexpected backend failures are caught with try/catch and logged.
