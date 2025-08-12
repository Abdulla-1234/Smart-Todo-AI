from django.urls import path
from . import views

urlpatterns = [
    path("tasks/", views.TaskListCreateView.as_view(), name="tasks"),
    path("categories/", views.CategoryListView.as_view(), name="categories"),
    path("context/", views.ContextListCreateView.as_view(), name="context"),
    path("ai/suggestions/", views.ai_suggestions, name="ai_suggestions"),  # <-- AI route
]
