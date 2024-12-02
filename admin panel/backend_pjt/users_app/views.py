from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MessageSerializer, UserSignupSerializer,UserSerializer
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



class UserLoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

# class UserLoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         # Get username and password from the request
#         username = request.data.get('username')
#         password = request.data.get('password')

#         # Authenticate user
#         user = authenticate(username=username, password=password)
#         if user:
#             # Generate JWT tokens for the user
#             refresh = RefreshToken.for_user(user)
            
#             # Prepare the response data
#             response_data = {
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'user': {
#                     'username': user.username,
#                     'email': user.email,
#                     'is_admin': user.is_admin,  # Include the user's role (admin or not)
#                 }
#             }
            
#             # Return the response with the tokens and user data
#             return Response(response_data)

#         # If authentication fails, return an error message
#         return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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
            # Invalidate the refresh token if you are using a refresh mechanism
            # For JWT, typically no server-side action is needed
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Failed to log out."}, status=status.HTTP_400_BAD_REQUEST)
        




class UserListView(APIView):
    permission_classes = [IsAdminUser]  # Ensure only admins can access this view

    def get(self, request):
        # Fetch all users from the User model
        users = User.objects.all()
        
        # Serialize the users and their profiles data
        serializer = UserSerializer(users, many=True)
        
        # Return the serialized data as a response
        return Response(serializer.data)