# Generated by Django 2.1.5 on 2019-02-02 23:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0008_auto_20190103_0055'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='featured_text',
            field=models.TextField(default='Este es un texto de prueba y es el showrt text que ira en el featured blog post, el blog post mas reciente del blog. Debe ser informativo y un poco mas extenso que el short text de la descripcion de las demas entradas del blog sin embargo tampoco debe ser taaaaan largo que contenga basicamento todo lo que queremos decir en el post'),
            preserve_default=False,
        ),
    ]
