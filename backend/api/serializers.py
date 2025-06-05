from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):  # Changed from Serializer to ModelSerializer
    class Meta:
        model = Note  # Changed from string 'Note' to actual model
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {
            'author': {'read_only': True},
            'created_at': {'read_only': True}
        }

    def create(self, validated_data):
        # Get the user from the request context
        user = self.context['request'].user
        # Create and return the new note
        return Note.objects.create(author=user, **validated_data)