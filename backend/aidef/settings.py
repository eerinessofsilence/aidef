from os import getenv
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = getenv("DJANGO_SECRET")
DEBUG = True
ALLOWED_HOSTS = ["*", "backend", "localhost", "127.0.0.1", "173.242.51.20"]

INSTALLED_APPS = [
    'modeltranslation',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'users.apps.UsersConfig',
    'main.apps.MainConfig',
    'portal.apps.PortalConfig',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'aidef.middleware.QueryLanguageMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'aidef.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'aidef.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': getenv('DB_HOST', getenv('POSTGRES_HOST', 'db')),
        'PORT': getenv('DB_PORT', getenv('POSTGRES_PORT', '5432')),
        'USER': getenv('DB_USER', getenv('POSTGRES_USER', 'aidef')),
        'PASSWORD': getenv('DB_PASS', getenv('POSTGRES_PASSWORD', 'aidef_password')),
        'NAME': getenv('DB_NAME', getenv('POSTGRES_DB', 'aidef')),
        'ATOMIC_REQUESTS': True,
    }
}

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en'
LANGUAGES = [
    ('en', 'English'),
    ('de', 'German'),
    ('sk', 'Slovak'),
]
MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'
MODELTRANSLATION_LANGUAGES = ('en', 'de', 'sk')
MODELTRANSLATION_FALLBACK_LANGUAGES = ('en',)
TIME_ZONE = getenv('TIME_ZONE', 'Europe/Kyiv')
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:4173',
    'http://localhost:4173',
    'http://173.242.51.20',
]
CSRF_TRUSTED_ORIGINS = ['http://173.242.51.20']

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
