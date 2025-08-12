from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    usage_frequency = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Task(models.Model):
    STATUS_PENDING = "pending"
    STATUS_IN_PROGRESS = "in-progress"
    STATUS_COMPLETED = "completed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_COMPLETED, "Completed"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    priority_score = models.IntegerField(default=0)
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ContextEntry(models.Model):
    SOURCE_WHATSAPP = "whatsapp"
    SOURCE_EMAIL = "email"
    SOURCE_NOTES = "notes"

    SOURCE_CHOICES = [
        (SOURCE_WHATSAPP, "WhatsApp"),
        (SOURCE_EMAIL, "Email"),
        (SOURCE_NOTES, "Notes"),
    ]

    content = models.TextField()
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    processed_insights = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source_type} @ {self.created_at}"
