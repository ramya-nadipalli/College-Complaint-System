"""college_portal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from Complaints import views
from django.shortcuts import render

def home_view(request):
    return render(request, 'home.html')

urlpatterns = [
    path('acet-complaint-portal', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('register/', views.register_user, name='register_user'),
    path('login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='logout'),
    path('admin-login/', views.admin_login, name='admin_login'),
    path('admin-panel/', views.admin_view, name='admin_view'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('submit/', views.submit_complaint, name='submit_complaint'),
    path('my/', views.view_complaints, name='view_complaints'),
    path('export-csv/', views.export_csv, name='export_csv'),
    path('update-status/<int:complaint_id>/<str:new_status>/', views.update_status, name='update_status'),
    path('complaints/', include('Complaints.urls')),
]