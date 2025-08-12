from rest_framework import serializers
from .models import Task, Category, ContextEntry
from . import ai_module

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "usage_frequency"]

class TaskSerializer(serializers.ModelSerializer):
    # Represent category as its name for simpler frontend integration
    category = serializers.CharField(allow_null=True, allow_blank=True, required=False)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "category",
            "priority_score",
            "deadline",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = instance.category.name if instance.category else None
        return data

    def _get_category(self, name: str | None):
        if not name:
            return None
        cat, _ = Category.objects.get_or_create(name=name)
        return cat

    def create(self, validated_data):
        cat_name = validated_data.pop("category", None)
        validated_data["category"] = self._get_category(cat_name)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        cat_name = validated_data.pop("category", None)
        if cat_name is not None:
            instance.category = self._get_category(cat_name)
        return super().update(instance, validated_data)

class ContextEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextEntry
        fields = ["id", "content", "source_type", "processed_insights", "created_at"]
        read_only_fields = ["processed_insights", "created_at", "id"]

    def create(self, validated_data):
        entry = ContextEntry(**validated_data)
        # Optionally analyze across recent entries (simplified to just this one)
        insights = ai_module.analyze_context([{"content": entry.content, "source_type": entry.source_type}])
        entry.processed_insights = insights
        entry.save()
        # bump category usage heuristically if keywords match a category
        return entry
