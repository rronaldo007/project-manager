from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q

from .serializers import UserRegistrationSerializer, UserSerializer, UserProfileSerializer, UserProfileUpdateSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=email, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    User profile view that handles both personal and professional information

    GET: Retrieve complete user profile including professional info
    PUT/PATCH: Update user profile with validation
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Get user profile with enhanced professional information
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Add additional professional info context
        data = serializer.data
        data['professional_info'] = {
            'phone': instance.phone or '',
            'company': instance.company or '',
            'role': instance.role or '',
            'location': instance.location or '',
            'has_complete_profile': all([
                instance.first_name,
                instance.last_name,
                instance.email,
                instance.phone,
                instance.company,
                instance.role
            ])
        }

        return Response(data)

    def update(self, request, *args, **kwargs):
        """
        Update user profile with professional information validation
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if serializer.is_valid():
            # Custom validation for professional info
            professional_fields = ['phone', 'company', 'role', 'location']
            updated_fields = []

            for field in professional_fields:
                if field in serializer.validated_data:
                    old_value = getattr(instance, field, '') or ''
                    new_value = serializer.validated_data[field] or ''
                    if old_value != new_value:
                        updated_fields.append(field)

            self.perform_update(serializer)

            # Return the updated user data with professional info
            profile_serializer = UserProfileSerializer(instance)
            response_data = profile_serializer.data

            # Add update metadata
            response_data['update_info'] = {
                'updated_fields': updated_fields,
                'professional_fields_updated': len(updated_fields),
                'timestamp': instance.updated_at.isoformat() if hasattr(instance, 'updated_at') else None
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def professional_info_view(request):
    """
    Dedicated endpoint for professional information
    Returns comprehensive professional profile data
    """
    user = request.user

    professional_data = {
        'user_id': user.id,
        'professional_info': {
            'phone': user.phone or '',
            'company': user.company or '',
            'role': user.role or '',
            'location': user.location or '',
        },
        'profile_completeness': {
            'has_phone': bool(user.phone),
            'has_company': bool(user.company),
            'has_role': bool(user.role),
            'has_location': bool(user.location),
            'completion_percentage': sum([
                bool(user.phone),
                bool(user.company),
                bool(user.role),
                bool(user.location)
            ]) * 25  # 25% for each field
        },
        'display_name': f"{user.first_name} {user.last_name}".strip() or user.username,
        'professional_summary': {
            'title': user.role or 'Professional',
            'company': user.company or 'Company',
            'location': user.location or 'Location',
            'contact': user.phone or user.email
        }
    }

    return Response(professional_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_professional_info_view(request):
    """
    Dedicated endpoint for updating only professional information
    """
    user = request.user

    # Define allowed professional fields
    allowed_fields = ['phone', 'company', 'role', 'location']
    updated_fields = []
    errors = {}

    for field in allowed_fields:
        if field in request.data:
            value = request.data[field]
            if isinstance(value, str):
                # Validate field length based on model constraints
                max_lengths = {
                    'phone': 20,
                    'company': 100,
                    'role': 100,
                    'location': 100
                }

                if len(value) > max_lengths[field]:
                    errors[field] = f"Ensure this field has no more than {max_lengths[field]} characters."
                else:
                    old_value = getattr(user, field, '') or ''
                    if old_value != value:
                        setattr(user, field, value)
                        updated_fields.append(field)
            else:
                errors[field] = "This field must be a string."

    if errors:
        return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

    if updated_fields:
        user.save(update_fields=updated_fields + ['updated_at'] if hasattr(user, 'updated_at') else updated_fields)

    # Return updated professional info
    response_data = {
        'message': 'Professional information updated successfully' if updated_fields else 'No changes detected',
        'updated_fields': updated_fields,
        'professional_info': {
            'phone': user.phone or '',
            'company': user.company or '',
            'role': user.role or '',
            'location': user.location or '',
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
