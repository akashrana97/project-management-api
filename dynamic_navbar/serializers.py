from rest_framework import serializers
from .models import NavItem

class NavItemSerializer(serializers.ModelSerializer):
    sub_items = serializers.SerializerMethodField()

    class Meta:
        model = NavItem
        fields = ['id', 'title', 'url', 'parent', 'order', 'sub_items']

    def get_sub_items(self, obj):
        return NavItemSerializer(obj.sub_items.all(), many=True).data
