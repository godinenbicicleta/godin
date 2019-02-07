from django.shortcuts import render, get_object_or_404
from .models import Blog

def allblogs(request):
    blogs = Blog.objects.all()[1:]
    featured = Blog.objects.all()[0]
    page_title = 'Blog'
    return render(request, 'blog/allblogs.html', 
    {'featured':featured,'blogs': blogs, 'page_title':page_title }
    )

def detail(request, blog_id):
    blog = get_object_or_404(Blog, pk = blog_id)
    page_title = f'Post #{blog_id}'
    return render(request, 'blog/blog.html',{'blog':blog,
    'page_title':page_title}) 
