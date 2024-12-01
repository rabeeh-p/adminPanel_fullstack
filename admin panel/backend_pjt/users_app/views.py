from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MessageSerializer, UserSignupSerializer
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from rest_framework.views import APIView

from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
# Create your views here.


@api_view(['GET'])
def hello_world(request):
    data = {"message": "Hello, World!"}
    serializer = MessageSerializer(data)
    return Response(serializer.data)


@csrf_exempt
def user_signup(request):
    if request.method == 'POST':
        # Parse the form data, including files
        form_data = {
            'username': request.POST.get('username'),
            'email': request.POST.get('email'),
            'password': request.POST.get('password'),
            'phone_number': request.POST.get('phone_number', ''),
            'image': request.FILES.get('image'),
        }

        # Initialize the serializer with form data
        serializer = UserSignupSerializer(data=form_data)

        # Check if the serializer is valid
        if serializer.is_valid():
            # Save the user data
            serializer.save()
            return JsonResponse({"message": "User created successfully!"}, status=201)
        else:
            return JsonResponse({"error": serializer.errors}, status=400)
    
    return JsonResponse({"error": "Invalid request"}, status=400)






class UserLoginView(APIView):
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
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user  # Get the currently logged-in user
    user_details = {
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    return Response(user_details)