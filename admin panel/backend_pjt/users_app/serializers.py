from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class MessageSerializer(serializers.Serializer):
    
    message = serializers.CharField(max_length=100)





class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=15)
    image = serializers.ImageField(required=False)
    first_name = serializers.CharField(required=True, max_length=30)  
    last_name = serializers.CharField(required=True, max_length=30)   

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'image']

    def create(self, validated_data):
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'password': validated_data['password'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
        }
        
        user = User.objects.create_user(**user_data)

        phone_number = validated_data.get('phone_number', '')
        image = validated_data.get('image', None)
        profile_data = {
            'user': user,
            'phone_number': phone_number,
            'image': image
        }
        UserProfile.objects.create(**profile_data)

        return user
    


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'image','blocked']

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()  

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'date_joined', 'is_staff', 'is_active', 'profile'
        ]

    def get_profile(self, obj):
        try:
            profile = obj.profile  
            return UserProfileSerializer(profile).data
        except UserProfile.DoesNotExist:
            return None   
        
    










class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'image', 'blocked']

class UserUpdateSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'is_active', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if profile_data:
            profile_instance = instance.profile
            for attr, value in profile_data.items():
                setattr(profile_instance, attr, value)
            profile_instance.save()

        instance.save()
        return instance