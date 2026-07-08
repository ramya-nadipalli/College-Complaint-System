from django.db import models
from django.contrib.auth.models import User

class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ('Hostel', 'Hostel'),
        ('Academics', 'Academics'),
        ('Infrastructure', 'Infrastructure'),
        ('Others', 'Others')
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved')
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    response = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.status})"
    