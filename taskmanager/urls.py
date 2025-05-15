from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('project.urls')),
    path('api/', include('dynamic_navbar.urls')),
]
