اضافه کردن assets


اضافه کردن اپ  channels, SupChat به پروژه


اضافه کردن فیلتر تگ به این صورت

       'libraries':{
                'supchat_filter':'SupChat.templatetags.filter'
       }
       
     
ست کردن ASGI

    ASGI_APPLICATION = 'SupChat.core.routing.application'
    
    
اضافه کردن ردیس

    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [("127.0.0.1", 6379)],  # ip and port default redis
            },
        },
    }


افزودن url supchat

افزودن کانفیگ ها در تمپلیت

    <script>
        const URL_BACKEND_SUPCHAT = 'http://127.0.0.1:8000';
        const ROOT_URL_ASSETS_SUPCHAT = '/assets/';
        const AUTO_RUN_SUPCHAT = true // Default is true;
    </script>
    <script src="/assets/supchat/js/mixins.js"></script>
    <script src="/assets/supchat/js/easy_supchat.js"></script>

Migrate


تنظیم نام فولدر اصلی در SupChat.asgi


ست کردن دامنه در فایل SupChat.config 


ایجاد ابجکت ها