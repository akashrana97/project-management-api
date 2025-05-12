# 📝 Task Manager API

A RESTful API for managing users, projects, tasks, and comments built with Django and Django REST Framework. This project supports user authentication via JWT, nested resource routing, and secure CRUD operations for project management.

---

## 🚀 Features

- User registration and JWT-based login
- Full CRUD for:
  - Users
  - Projects
  - Tasks (nested under projects)
  - Comments (nested under tasks)
- Authentication & authorization
- Clean ViewSet-based architecture
- Fully REST-compliant endpoints

---

## 🛠️ Tech Stack

- Python 3.13+
- Django 5.2
- Django REST Framework
- Simple JWT (Token Authentication)
- SQLite (default, easily swappable)

--- 

# Clone the repo
git clone https://github.com/akashrana97/project-management-api.git
cd taskmanager

# Create virtual environment
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Run the server
python manage.py runserver

--- 

# 📝 API Reference

Reference - https://documenter.getpostman.com/view/28220170/2sB2jAb84f

---