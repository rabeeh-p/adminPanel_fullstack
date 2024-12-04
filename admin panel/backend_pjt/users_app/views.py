from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MessageSerializer, UserSignupSerializer,UserSerializer,UserProfileSerializer,UserUpdateSerializer,UserProfile
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import api_view, permission_classes

from rest_framework.views import APIView

from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from .models import UserProfile
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
# Create your views here.


@api_view(['GET'])
def hello_world(request):
    data = {"message": "Hello, World!"}
    serializer = MessageSerializer(data)
    return Response(serializer.data)


@api_view(['POST'])
def user_signup(request):
    print('is working signup')

    serializer = UserSignupSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse({"message": "User created successfully!"}, status=201)
    else:
        print("Validation errors:", serializer.errors)

        return JsonResponse({"error": serializer.errors}, status=400)



  

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:


            
            
            block_status = user.profile.blocked if hasattr(user, 'profile') else False
            refresh = RefreshToken.for_user(user)
            
            print(user.is_superuser,'admin')
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'is_superuser': user.is_superuser,  
                    'block': block_status
                }
            }
            
            return Response(response_data)

        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    print('working')
    user = request.user  
    
    user_details = {
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "image": request.build_absolute_uri(user.profile.image.url) if hasattr(user, 'profile') and user.profile.image else None,
        "phone_number": user.profile.phone_number if user.profile else None 
    }
    return Response(user_details)


class LogoutView(APIView):

    def post(self, request):
        try:
           
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Failed to log out."}, status=status.HTTP_400_BAD_REQUEST)
        


class UserListView(APIView):
    permission_classes = [IsAdminUser]
    print('Admin side is working')

    def get(self, request):
        print('Admin side is working')
        
        users = User.objects.filter(is_superuser=False) 
        
        serializer = UserSerializer(users, many=True)
        
        return Response(serializer.data)
    





class UserDetailView(RetrieveAPIView):
    permission_classes = [IsAdminUser]  
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        print('is workign admin')
        user_id = self.kwargs['userId']
        print(user_id,'id')
        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            raise NotFound(detail="User not found.", code=404)
    

class BlockUnblockUserView(APIView):
    permission_classes = [IsAuthenticated]  

    def put(self, request, user_id):
        print('is wokring put')
        user_profile = get_object_or_404(UserProfile, user__id=user_id)  
        user_profile.blocked = not user_profile.blocked
        user_profile.save()  

        action = "blocked" if user_profile.blocked else "unblocked" 

        return Response(
            {"message": f"User has been {action} successfully."},
            status=status.HTTP_200_OK
        )
    
class EditUserDetails(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, user_id):
        """Handle PUT request to edit user details."""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the admin is trying to edit a superuser (prevent superuser editing)
        if user.is_superuser:
            return Response({"detail": "Cannot edit superuser details."}, status=status.HTTP_403_FORBIDDEN)

        # Use the new serializer for user updates
        serializer = UserUpdateSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()  # Save the updated user details
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_user(request):
    user = request.user
    data = request.data

    try:
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.save()

        profile = UserProfile.objects.get(user=user)
        profile.phone_number = data.get("phone_number", profile.phone_number)

        if 'image' in request.FILES:
            profile.image = request.FILES['image']

        profile.save()

        user_serializer = UserSerializer(user)
        profile_serializer = UserProfileSerializer(profile)

        return Response(
            {
                "user": user_serializer.data,
                "profile": profile_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": "Failed to update user details", "details": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user(request):
    data = request.data
    try:
        user = User.objects.create_user(
            username=data["username"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            password=data["password"]
        )
        user.save()

        UserProfile.objects.create(
            user=user,
            blocked=False  # Default blocked value
        )
        return Response({"message": "User created successfully"}, status=HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)