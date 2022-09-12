from channels.routing import get_default_application
import os
import django

PROJECT_SETTINGS = 'Config.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE',PROJECT_SETTINGS)
django.setup()
application = get_default_application()