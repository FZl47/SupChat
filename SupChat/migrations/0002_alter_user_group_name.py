# Generated by Django 3.2 on 2022-09-12 23:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SupChat', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='group_name',
            field=models.CharField(default='Group_User_7GRkN1DVBySW7Az3zC40JY2c5', max_length=40),
        ),
    ]
