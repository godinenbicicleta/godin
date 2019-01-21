from django.db import models

class Job(models.Model):
    image = models.ImageField(upload_to = 'images/', blank=True)
    summary = models.CharField(max_length = 200 )

class Project(models.Model):
    image = models.ImageField(upload_to = 'images/', blank=True)
    summary = models.CharField(max_length = 200 )
    title = models.CharField(max_length=200)
    link = models.CharField(max_length=200)
