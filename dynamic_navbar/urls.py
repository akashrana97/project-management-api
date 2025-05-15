from rest_framework.routers import DefaultRouter
from .views import NavItemViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'nav-items', NavItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
