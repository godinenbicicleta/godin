# Generated by Django 2.1.5 on 2019-02-03 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0010_auto_20190203_0100'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='d3js',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='blog',
            name='highlightjs',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='blog',
            name='leafletjs',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='blog',
            name='topojsonjs',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
