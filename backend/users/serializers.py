from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')
        read_only_fields = ('id', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        trim_whitespace=False,
    )
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    team = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'name', 'team')

    def validate_email(self, value):
        normalized = User.objects.normalize_email(value)
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized

    def validate(self, attrs):
        password = attrs.get('password')
        user = User(
            email=attrs.get('email'),
            first_name=attrs.get('first_name', ''),
            last_name=attrs.get('last_name', ''),
        )
        validate_password(password, user=user)
        return attrs

    def create(self, validated_data):
        name = validated_data.pop('name', '').strip()
        validated_data.pop('team', None)

        if name:
            first_name = validated_data.get('first_name')
            last_name = validated_data.get('last_name')
            if not first_name and not last_name:
                parts = name.split(' ', 1)
                validated_data['first_name'] = parts[0]
                if len(parts) > 1:
                    validated_data['last_name'] = parts[1]
            elif not first_name:
                validated_data['first_name'] = name

        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        request = self.context.get('request')
        user = authenticate(
            request=request,
            email=attrs.get('email'),
            password=attrs.get('password'),
        )
        if not user:
            raise serializers.ValidationError('Invalid email or password.', code='authorization')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.', code='authorization')
        attrs['user'] = user
        return attrs
