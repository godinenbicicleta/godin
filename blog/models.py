from django.db import models

# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length = 200 )
    image = models.ImageField(upload_to = 'images/')
    body = models.TextField()
    pub_date = models.DateField()
    category = models.CharField(max_length = 40)

    def __str__(self):
        return f'{self.category}: {self.title}'

    def summary(self):
        return ''.join([self.body[:140],self.body[140:].split(' ')[0]])
