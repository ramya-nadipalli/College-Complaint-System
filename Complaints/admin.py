from django.contrib import admin
from Complaints.models import Complaint

class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('student', 'title', 'status', 'submitted_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'description')
    readonly_fields = ('student', 'title', 'description', 'submitted_at')

    
admin.site.register(Complaint,ComplaintAdmin)
