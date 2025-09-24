from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.contrib.auth.models import User

from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer
)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            # Log the user in after registration
            login(request, user)
            user_data = UserSerializer(user).data
            
            response_data = {
                "user": user_data,
                "message": "User registered successfully"
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            # Create Django session
            login(request, user)
            
            user_data = UserSerializer(user).data
            
            response_data = {
                "user": user_data,
                "message": "Login successful"
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to logout
    
    def post(self, request):
        logout(request)
        return Response(
            {"message": "Logout successful"}, 
            status=status.HTTP_200_OK
        )

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_data = UserSerializer(request.user).data
        return Response(user_data, status=status.HTTP_200_OK)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
