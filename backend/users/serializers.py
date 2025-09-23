from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password fields didn't match.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'bio', 'avatar', 'phone', 'company', 'role', 'location', 'created_at')
        read_only_fields = ('id', 'created_at')


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'bio', 'avatar', 'phone', 'company', 'role', 'location', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_email(self, value):
        """Validate that email is unique (excluding current user)"""
        user = self.instance
        if user and User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer specifically for profile updates"""
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'phone', 'bio', 'company', 'role', 'location')

    def validate_email(self, value):
        """Validate that email is unique (excluding current user)"""
        user = self.instance
        if user and User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        """Validate phone number format"""
        if value and len(value.strip()) > 0:
            # Remove spaces and common phone characters for length check
            clean_phone = ''.join(c for c in value if c.isdigit() or c in ['+', '-', '(', ')', ' '])
            if len(clean_phone) < 10:
                raise serializers.ValidationError("Phone number must be at least 10 digits long.")
        return value

    def validate_company(self, value):
        """Validate company name"""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Company name must be at least 2 characters long.")
        return value

    def validate_role(self, value):
        """Validate role/position"""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Role must be at least 2 characters long.")
        return value


class ProfessionalInfoSerializer(serializers.ModelSerializer):
    """Serializer specifically for professional information"""
    completion_percentage = serializers.SerializerMethodField()
    display_title = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('phone', 'company', 'role', 'location', 'completion_percentage', 'display_title')

    def get_completion_percentage(self, obj):
        """Calculate professional profile completion percentage"""
        fields = [obj.phone, obj.company, obj.role, obj.location]
        completed = sum(1 for field in fields if field and field.strip())
        return (completed / len(fields)) * 100

    def get_display_title(self, obj):
        """Get formatted professional title"""
        if obj.role and obj.company:
            return f"{obj.role} at {obj.company}"
        elif obj.role:
            return obj.role
        elif obj.company:
            return f"Professional at {obj.company}"
        else:
            return "Professional"