# Generated by Django 2.1.7 on 2019-04-16 17:24

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0010_auto_20190416_1913'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='members',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
