# SupChat
##### Support Chat


## How to use ?

- Install requirments
```python
  pip install -r requirments.txt or pip install -r requirments_ubuntu.txt
```
- Add apps **django_render_partial** , **channels** , **Chat** to **INSTALLED_APPS** your project

- Set **asgi** instead **wsgi** in settings
```python
  ASGI_APPLICATION = 'Chat.routing.application'
```

- Config channel layer in settings
```python
# You need redis here
  CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)], # ip and port default redis
        },
    },
  }
```

- Add **filter tags** in **Templates.OPTIONS.libraries** in settings
```python
  'FilterTagsSupChat': 'Chat.filter_tags.templatetags.Filter'
```

- Include **url supchat** in urls base
```python
  path('sup-chat/',include('Chat.urls',namespace='SupChat'))
```

- Set **name project settings** to **asgi file**
```python
# By Default is 'Config.settings'
  PROJECT_SETTINGS = 'Config.settings'
```

- Copy folder **supchat** to **static folder** 
- Load **render_partial** in your page
- Include **SupChat** view in your page
```python
  {% render_partial 'Chat.views.index' %}
```
- Migrate
```python
  python manage.py migrate
```
- ## Deploy
 run with daphne
 ```python
  daphne -b YOUR_IP -b YOUR_PORT Chat.asgi:application
 ```
- Done!
