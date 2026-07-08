from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.submit_complaint, name='submit_complaint'),
    path('my/', views.view_complaints, name='view_complaints'),
    path('admin-panel/', views.admin_view, name='admin_view'),
]