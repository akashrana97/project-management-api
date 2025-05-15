from django.contrib import admin
from .models import NavItem

class NavItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'parent', 'order')
    list_filter = ('parent',)
    ordering = ('parent', 'order')

admin.site.register(NavItem, NavItemAdmin)
