from django.db import models
import markdown

# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length = 200 )
    short_text = models.CharField(max_length = 250)
    featured_text = models.TextField()
    image = models.ImageField(upload_to = 'images/', blank = True)
    rawBody = models.TextField(default=None, blank=True, null=True)
    mdBody = models.TextField(default=None, blank=True, null=True)
    pub_date = models.DateField()
    category = models.CharField(max_length = 40)
    leafletjs = models.BooleanField()
    d3js = models.BooleanField()
    highlightjs = models.BooleanField()
    topojsonjs = models.BooleanField()
    code_files = models.TextField(default=None, blank=True, null=True)
    estilos_files = models.TextField(default=None, blank=True, null=True)

    def __str__(self):
        return f'{self.category}: {self.title}'

    def summary(self):
        return markdown.markdown(self.short_text, extensions =
        ['fenced_code','codehilite'])

    def featured(self):
        return markdown.markdown(self.featured_text, extensions =
        ['fenced_code','codehilite'])

    def get_image(self):
        if self.image:
            return self.image.url;

    def mycode(self):
        if self.code_files:
            return ["js/mycode/"+fili for fili in self.code_files.split(',')]
        return None

    def estilos(self):
        if self.estilos_files:
            return ["css/blog/"+estilo for estilo in self.estilos_files.split(',')]
        return None

    def body_md(self):
       return  markdown.markdown(self.mdBody, extensions =
       ['fenced_code','codehilite'])

    class Meta:
        ordering = ["-id"]
