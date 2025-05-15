from rest_framework import viewsets
from rest_framework.response import Response
from .models import NavItem
from .serializers import NavItemSerializer

class NavItemViewSet(viewsets.ModelViewSet):
    queryset = NavItem.objects.all()
    serializer_class = NavItemSerializer

    def list(self, request, *args, **kwargs):
        # Prefetch the sub_items to optimize DB queries
        parent_items = NavItem.objects.filter(parent=None).prefetch_related('sub_items')
        serialized_items = NavItemSerializer(parent_items, many=True).data
        return Response(serialized_items)
