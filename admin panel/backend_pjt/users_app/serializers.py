from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class MessageSerializer(serializers.Serializer):
    
    message = serializers.CharField(max_length=100)




# class UserSignupSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, min_length=8)
#     phone_number = serializers.CharField(required=False, allow_blank=True, max_length=15)
#     image = serializers.ImageField(required=False)

#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'phone_number', 'image']

#     def create(self, validated_data):
#         # Extract user data and create the user
#         user_data = {key: validated_data[key] for key in ['username', 'email', 'password']}
#         user = User.objects.create_user(**user_data)

#         # Extract profile data and create a UserProfile
#         phone_number = validated_data.get('phone_number', '')
#         image = validated_data.get('image', None)
#         profile_data = {
#             'user': user,
#             'phone_number': phone_number,
#             'image': image
#         }
#         UserProfile.objects.create(**profile_data)

#         return user

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=15)
    image = serializers.ImageField(required=False)
    first_name = serializers.CharField(required=True, max_length=30)  # First Name
    last_name = serializers.CharField(required=True, max_length=30)   # Last Name

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'image']

    def create(self, validated_data):
        # Extract user data, including first_name and last_name
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'password': validated_data['password'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
        }
        
        # Create the user with the data
        user = User.objects.create_user(**user_data)

        # Extract profile data (phone number and image) and create a UserProfile
        phone_number = validated_data.get('phone_number', '')
        image = validated_data.get('image', None)
        profile_data = {
            'user': user,
            'phone_number': phone_number,
            'image': image
        }
        UserProfile.objects.create(**profile_data)

        return user
    




# Serializer to include additional profile fields
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'image']

# Serializer to include User and UserProfile data
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()  # Nested serializer for user profile

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'is_staff', 'is_active', 'profile']