from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class MessageSerializer(serializers.Serializer):
    
    message = serializers.CharField(max_length=100)




class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=15)
    image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'image']

    def create(self, validated_data):
        # Extract user data and create the user
        user_data = {key: validated_data[key] for key in ['username', 'email', 'password']}
        user = User.objects.create_user(**user_data)

        # Extract profile data and create a UserProfile
        phone_number = validated_data.get('phone_number', '')
        image = validated_data.get('image', None)
        profile_data = {
            'user': user,
            'phone_number': phone_number,
            'image': image
        }
        UserProfile.objects.create(**profile_data)

        return user

