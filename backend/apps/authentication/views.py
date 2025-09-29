from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    print(f'DEBUG - Request method: {request.method}')
    print(f'DEBUG - Request content type: {request.content_type}')
    print(f'DEBUG - Request body: {request.body}')
    print(f'DEBUG - Request data: {request.data}')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'non_field_errors': ['Email and password are required.']}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user_obj = User.objects.get(email=email)
        username = user_obj.username
    except User.DoesNotExist:
        return Response(
            {'non_field_errors': ['Invalid email or password.']}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None and user.is_active:
        login(request, user)
        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined.isoformat()
            },
            'message': 'Login successful'
        })
    else:
        return Response(
            {'non_field_errors': ['Invalid email or password.']}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    try:
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name or '',
            'last_name': user.last_name or '',
            'date_joined': user.date_joined.isoformat()
        })
    except Exception as e:
        return Response(
            {'detail': 'Authentication error'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user with email, password, first_name, and last_name
    """
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    # Validation
    if not email or not password:
        return Response(
            {'non_field_errors': ['Email and password are required.']}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if email already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {'email': ['A user with this email already exists.']}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create username from email (you can modify this logic)
    username = email.split('@')[0]
    
    # Handle username conflicts by appending numbers
    base_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    
    try:
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Automatically log the user in after registration
        login(request, user)
        
        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined.isoformat()
            },
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
        
    except IntegrityError:
        return Response(
            {'non_field_errors': ['An error occurred during registration. Please try again.']}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'non_field_errors': [f'Registration failed: {str(e)}']}, 
            status=status.HTTP_400_BAD_REQUEST
        )

