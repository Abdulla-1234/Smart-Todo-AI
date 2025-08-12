from django.contrib import admin
from .models import Task, Category, ContextEntry

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "usage_frequency")

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "priority_score", "status", "deadline", "created_at")
    list_filter = ("status", "category")

@admin.register(ContextEntry)
class ContextEntryAdmin(admin.ModelAdmin):
    list_display = ("id", "source_type", "created_at")
