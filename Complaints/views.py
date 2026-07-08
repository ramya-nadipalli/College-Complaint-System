from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from Complaints.forms import ComplaintForm
from Complaints.models import Complaint
from django.db.models import Count
from django.http import HttpResponse
import csv

def register_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password != confirm_password:
            return render(request, 'register.html', {'error': 'Passwords do not match'})

        if User.objects.filter(username=username).exists():
            return render(request, 'register.html', {'error': 'Username already taken'})

        if User.objects.filter(email=email).exists():
            return render(request, 'register.html', {'error': 'Email already registered'})

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_staff = False
        user.save()
        return redirect('user_login')

    return render(request, 'register.html')


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if not user.is_staff:
                login(request, user)
                return redirect('view_complaints')
            else:
                return render(request, 'login.html', {'form': form, 'error': 'Admins cannot login here.'})
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


def admin_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.is_staff:
                login(request, user)
                return redirect('admin_dashboard')
            else:
                return render(request, 'admin_login.html', {'form': form, 'error': 'Only admins allowed here.'})
    else:
        form = AuthenticationForm()
    return render(request, 'admin_login.html', {'form': form})


def user_logout(request):
    logout(request)
    return redirect('user_login')


@login_required
def submit_complaint(request):
    if request.user.is_staff:
        return redirect('admin_dashboard')
    if request.method == 'POST':
        form = ComplaintForm(request.POST)
        if form.is_valid():
            complaint = form.save(commit=False)
            complaint.student = request.user
            complaint.save()
            return redirect('view_complaints')
    else:
        form = ComplaintForm()
    return render(request, 'submit_complaint.html', {'form': form})


@login_required
def view_complaints(request):
    if request.user.is_staff:
        return redirect('admin_dashboard')
    complaints = Complaint.objects.filter(student=request.user)
    return render(request, 'view_complaints.html', {'complaints': complaints})


@login_required
def user_dashboard(request):
    if request.user.is_staff:
        return redirect('admin_dashboard')
    return render(request, 'user_dashboard.html')


@login_required
def admin_view(request):
    if not request.user.is_staff:
        return redirect('submit_complaint')
    status_filter = request.GET.get('status')
    if status_filter:
        all_complaints = Complaint.objects.filter(status=status_filter)
    else:
        all_complaints = Complaint.objects.all()
    return render(request, 'admin_view.html', {'complaints': all_complaints})


@login_required
def admin_dashboard(request):
    if not request.user.is_staff:
        return redirect('submit_complaint')
    status_counts = Complaint.objects.values('status').annotate(count=Count('status'))
    category_counts = Complaint.objects.values('category').annotate(count=Count('category'))
    total_complaints = Complaint.objects.count()
    context = {
        'status_counts': status_counts,
        'category_counts': category_counts,
        'total_complaints': total_complaints,
    }
    return render(request, 'admin_dashboard.html', context)


@login_required
def update_status(request, complaint_id, new_status):
    if not request.user.is_staff:
        return redirect('submit_complaint')
    complaint = Complaint.objects.get(id=complaint_id)
    complaint.status = new_status
    complaint.save()
    return redirect('admin_view')


@login_required
def export_csv(request):
    if not request.user.is_staff:
        return redirect('submit_complaint')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="complaints_report.csv"'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Student', 'Title', 'Category', 'Status', 'Response', 'Submitted At'])
    complaints = Complaint.objects.all()
    for c in complaints:
        writer.writerow([
            c.id,
            c.student.username,
            c.title,
            c.category,
            c.status,
            c.response,
            c.submitted_at.strftime('%d-%m-%Y %I:%M %p')
        ])
    return response