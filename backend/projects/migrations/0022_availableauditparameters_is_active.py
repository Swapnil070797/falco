# Generated by Django 2.2 on 2019-06-19 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("projects", "0021_auto_20190618_1519")]

    operations = [
        migrations.AddField(
            model_name="availableauditparameters",
            name="is_active",
            field=models.BooleanField(default=True),
        )
    ]
