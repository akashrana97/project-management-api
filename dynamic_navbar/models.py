from django.core.exceptions import ValidationError
from django.db import models

class NavItem(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=255, blank=True, null=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='sub_items')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def clean(self):
        # Prevent sub-items from having sub-items
        if self.parent and self.parent.parent:
            raise ValidationError("Sub-items cannot have their own sub-items.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Triggers the clean() method
        super().save(*args, **kwargs)
