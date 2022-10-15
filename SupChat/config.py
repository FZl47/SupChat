""" Config SupChat """
import datetime
import pytz
from django.conf import settings
from django.utils import timezone
"""  Note!  """
#You must set name settings project in file "asgi.py"


ROOT_URL_ASSETS_SUPCHAT = settings.STATIC_URL
# Address server or domain
URL_BACKEND_SUPCHAT = 'http://127.0.0.1:8000'

# User Default is Django User
# if you want change user you must edit "getUser" and "getUserConsumer" function in core.auth.view and core.auth.consumer
from django.contrib.auth.models import User
USER = User

def get_datetime():
    # tz_str = settings.TIME_ZONE or 'UTC'
    # tz = pytz.timezone(tz_str)
    t = timezone.now()
    return t

