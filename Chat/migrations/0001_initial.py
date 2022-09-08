
import Chat.models
import Chat.core.tools
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=Chat.models.upload_image_admin_chat)),
                ('lastSeen', models.DateTimeField(default=django.utils.timezone.now)),
                ('status_online', models.CharField(choices=[('online', 'Online'), ('offline', 'Offline')], default='offline', max_length=10)),
                ('gender', models.CharField(choices=[('male', 'مرد'), ('female', 'زن')], max_length=10)),
                ('group_name', models.CharField(default=Chat.models.RandomStringGroupNameAdmin, editable=False, max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='ChatGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isActive', models.BooleanField(default=True)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.admin')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dateTimeSend', models.DateTimeField(auto_now_add=True)),
                ('sender', models.CharField(choices=[('admin', 'Admin'), ('user', 'User')], max_length=10)),
                ('seen', models.BooleanField(default=False)),
                ('edited', models.BooleanField(default=False)),
                ('deleted', models.BooleanField(default=False)),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.chatgroup')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('isActive', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='SupChatConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transferChatIsActive', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='SupChatStyle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('backgroundChat', models.ImageField(blank=True, null=True, upload_to=Chat.models.upload_image_background_chat)),
            ],
        ),
        migrations.CreateModel(
            name='AudioMessage',
            fields=[
                ('message_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='Chat.message')),
                ('type', models.CharField(default='audio', editable=False, max_length=10)),
                ('audio', models.FileField(upload_to=Chat.models.upload_audio_message)),
                ('audio_time', models.CharField(default='0', max_length=5)),
            ],
            options={
                'abstract': False,
            },
            bases=('Chat.message',),
        ),
        migrations.CreateModel(
            name='TextMessage',
            fields=[
                ('message_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='Chat.message')),
                ('type', models.CharField(default='text', editable=False, max_length=10)),
                ('text', models.TextField()),
            ],
            options={
                'abstract': False,
            },
            bases=('Chat.message',),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_key', models.CharField(default=Chat.core.tools.RandomString, max_length=50)),
                ('lastSeen', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('status_online', models.CharField(choices=[('online', 'Online'), ('offline', 'Offline')], default='offline', max_length=10)),
                ('group_name', models.CharField(default='Group_User_kRrPV40zeoXx57uCIQTuoFm9l', max_length=40)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SupChat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='ساپ چت', max_length=30)),
                ('config', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.supchatconfig')),
                ('style', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.supchatstyle')),
            ],
        ),
        migrations.CreateModel(
            name='SuggestedMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=200)),
                ('section', models.ManyToManyField(to='Chat.Section')),
            ],
        ),
        migrations.CreateModel(
            name='LogMessageAdmin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('message', models.TextField()),
                ('dateTimeSubmit', models.DateTimeField(auto_now_add=True)),
                ('seen', models.BooleanField(default=False)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.admin')),
            ],
            options={
                'ordering': ('-id',),
            },
        ),
        migrations.AddField(
            model_name='chatgroup',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.section'),
        ),
        migrations.AddField(
            model_name='chatgroup',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Chat.user'),
        ),
        migrations.AddField(
            model_name='admin',
            name='sections',
            field=models.ManyToManyField(to='Chat.Section'),
        ),
        migrations.AddField(
            model_name='admin',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
