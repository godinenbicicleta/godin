from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Job, Project

def home(request):
    jobs = Job.objects
    projects = Project.objects
    page_title = 'Home-Bruno'
    print(projects.count())
    return render(request, 'jobs/home.html', {'jobs':jobs,"projects":projects,
    'page_title':page_title})

def get_data(request):
    return JsonResponse({'holi':1})


def project_detail(request, pk):
    project = get_object_or_404(Project, pk = pk)
    page_title = f'Project #{pk}'
    return render(request, 'jobs/geo.html',{'project':project,
    'page_title':page_title}) 
