from django.shortcuts import render
from .models import Job

def home(request):
    jobs = Job.objects
    page_title = 'Home-Bruno'
    return render(request, 'jobs/home.html', {'jobs':jobs,
    'page_title':page_title})
