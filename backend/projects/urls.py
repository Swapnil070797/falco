from django.conf.urls import url
from django.urls import path
from projects import views
from rest_framework.urlpatterns import format_suffix_patterns

app_name = "projects"

urlpatterns = [
    path("", views.project_list),
    path("<uuid:project_uuid>/", views.project_detail),
    path("<uuid:project_uuid>/pages", views.project_page_list),
    path("<uuid:project_uuid>/pages/<uuid:page_uuid>", views.project_page_detail),
]
