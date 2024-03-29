# Generated by Django 3.2 on 2022-09-25 21:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SupChat', '0007_alter_blacklist_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='SystemMessage',
            fields=[
                ('textmessage_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='SupChat.textmessage')),
            ],
            options={
                'abstract': False,
            },
            bases=('SupChat.textmessage',),
        ),
        migrations.AlterField(
            model_name='message',
            name='sender',
            field=models.CharField(choices=[('system', 'System'), ('user', 'User'), ('user', 'User')], max_length=10),
        ),
    ]
