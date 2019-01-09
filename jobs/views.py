from django.shortcuts import render
from django.http import JsonResponse
from .models import Job

def home(request):
    jobs = Job.objects
    page_title = 'Home-Bruno'
    return render(request, 'jobs/home.html', {'jobs':jobs,
    'page_title':page_title})

def get_data(request):
    return JsonResponse({'holi':1})
