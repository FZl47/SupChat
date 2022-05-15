""" Config SupChat """

# You must set name settings project
# By Default is Config.settings
PROJECT_SETTINGS = 'Config.settings'

# User Default is Django User
# if you want change user you must edit "getUser" and "getUserConsumer" function in auth.view and auth.consumer
from django.contrib.auth.models import User
USER = User

