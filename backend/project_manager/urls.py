from django.contrib import admin
from django.urls import path, include
import json


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.authentication.urls")),
    path('api/projects/', include('apps.projects.urls')),
]
