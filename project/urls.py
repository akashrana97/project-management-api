# urls.py

from django.urls import path
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import (
    RegisterView, LoginView, UserViewSet, ProjectViewSet,
    TaskViewSet, CommentViewSet
)

# Base routers
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'comments', CommentViewSet, basename='comment')  # For direct access

# Nested: /projects/{project_id}/tasks/
project_router = NestedDefaultRouter(router, r'projects', lookup='project')
project_router.register(r'tasks', TaskViewSet, basename='project-tasks')

# Nested: /tasks/{task_id}/comments/
task_router = NestedDefaultRouter(router, r'tasks', lookup='task')
task_router.register(r'comments', CommentViewSet, basename='task-comments')

urlpatterns = [
    path('users/register/', RegisterView.as_view(), name='register'),
    path('users/login/', LoginView.as_view(), name='login'),
]

urlpatterns += router.urls + project_router.urls + task_router.urls
