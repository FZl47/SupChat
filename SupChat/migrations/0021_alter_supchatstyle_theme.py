# Generated by Django 3.2 on 2022-10-12 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SupChat', '0020_alter_supchatstyle_theme'),
    ]

    operations = [
        migrations.AlterField(
            model_name='supchatstyle',
            name='theme',
            field=models.CharField(choices=[('/supchat/css/theme/default.css', 'default'), ('/supchat/css/theme/purple.css', 'purple'), ('/supchat/css/theme/black_green.css', 'black green'), ('/supchat/css/theme/black_full.css', 'black full'), ('/supchat/css/theme/yellow.css', 'yellow'), ('/supchat/css/theme/blue.css', 'blue')], default='/supchat/css/theme/default.css', max_length=200),
        ),
    ]
