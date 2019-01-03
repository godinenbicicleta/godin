from django.db import models
import markdown

# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length = 200 )
    short_text = models.CharField(max_length = 250)
    image = models.ImageField(upload_to = 'images/', blank = True)
    body = models.TextField()
    pub_date = models.DateField()
    category = models.CharField(max_length = 40)

    def __str__(self):
        return f'{self.category}: {self.title}'

    def summary(self):
        return self.short_text

    def body_md(self):
       return  markdown.markdown(self.body, extensions =
       ['fenced_code','codehilite'])

    class Meta:
        ordering = ["-pub_date"]
