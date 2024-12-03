from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MessageSerializer, UserSignupSerializer,UserSerializer,UserProfileSerializer
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
# Create your views here.


@api_view(['GET'])
def hello_world(request):
    data = {"message": "Hello, World!"}
    serializer = MessageSerializer(data)
    return Response(serializer.data)


@api_view(['POST'])
def user_signup(request):
    print('is working signup')

    # Initialize the serializer with the form data from request.data
    serializer = UserSignupSerializer(data=request.data)

    # Check if the serializer is valid
    if serializer.is_valid():
        # Save the user and profile data
        serializer.save()
        return JsonResponse({"message": "User created successfully!"}, status=201)
    else:
        # Print the errors to the console for debugging
        print("Validation errors:", serializer.errors)

        # Return errors in the serializer validation
        return JsonResponse({"error": serializer.errors}, status=400)



# class UserLoginView(APIView):
#     permission_classes = [AllowAny] 
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(username=username, password=password)
#         if user:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             })
#         return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Get username and password from the request
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate user
        user = authenticate(username=username, password=password)
        if user:
            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            
            # Prepare the response data
            print(user.is_superuser,'admin')
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'is_superuser': user.is_superuser,  # Include the user's role (admin or not)
                }
            }
            
            # Return the response with the tokens and user data
            return Response(response_data)

        # If authentication fails, return an error message
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    print('working')
    user = request.user  # Get the currently logged-in user
    
    # Construct the user details response
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
    permission_classes = [IsAuthenticated]

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
        
        # Fetch all users
        users = User.objects.filter(is_superuser=False) 
        
        # Serialize users
        serializer = UserSerializer(users, many=True)
        
        return Response(serializer.data)
    


class UserDetailView(RetrieveAPIView):
    permission_classes = [IsAdminUser]  # Only allow admin users to access this view
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        # Get the user by userId from the URL
        user_id = self.kwargs['userId']
        print(user_id,'id')
        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            raise NotFound(detail="User not found.", code=404)
        

class BlockUnblockUserView(APIView):
    permission_classes = [IsAuthenticated]  # Make sure only authenticated users can access this endpoint

    def put(self, request, user_id):
        print('is wokring put')
        user_profile = get_object_or_404(UserProfile, user__id=user_id)  # Get the user profile by user_id

        # Toggle the blocked status
        user_profile.blocked = not user_profile.blocked
        user_profile.save()  # Save the new status

        action = "blocked" if user_profile.blocked else "unblocked"  # Determine the action (block or unblock)

        return Response(
            {"message": f"User has been {action} successfully."},
            status=status.HTTP_200_OK
        )
    



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_user(request):
    user = request.user
    data = request.data

    # Updating User fields
    try:
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.save()

        # Updating Profile fields if they exist
        profile = UserProfile.objects.get(user=user)
        profile.phone_number = data.get("phone_number", profile.phone_number)

        # Handle image upload
        if 'image' in request.FILES:
            profile.image = request.FILES['image']

        profile.save()

        # Serialize updated user data
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
    