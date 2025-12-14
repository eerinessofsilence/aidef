from django.contrib.auth.forms import AuthenticationForm, UserChangeForm, UserCreationForm
from .models import User


class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'is_superuser',
        )


class UserLoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ('email', 'password')


class UserAdminChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
        )
