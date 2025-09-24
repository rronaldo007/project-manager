from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "password", "confirm_password")
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"]
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        
        if email and password:
            try:
                user_obj = User.objects.get(email=email)
                username = user_obj.username
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid email or password.")
            
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError("Invalid email or password.")
            
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
            
            attrs["user"] = user
            return attrs
        else:
            raise serializers.ValidationError("Email and password are required.")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "date_joined")
        read_only_fields = ("id", "date_joined")