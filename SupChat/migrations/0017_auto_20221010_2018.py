# Generated by Django 3.2 on 2022-10-10 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SupChat', '0016_alter_chatgroup_rate_chat'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blacklist',
            name='reason',
        ),
        migrations.AlterField(
            model_name='message',
            name='sender',
            field=models.CharField(choices=[('system', 'System'), ('user', 'User'), ('admin', 'Admin')], max_length=10),
        ),
    ]
