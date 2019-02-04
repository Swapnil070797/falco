from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from projects.models import Page, Project
from projects.serializers import PageSerializer, ProjectSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser


@ensure_csrf_cookie
@api_view(["GET", "POST"])
def project_list(request):
    if request.method == "GET":
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            project = Project.objects.create(**serializer.validated_data)
            project.save()
            return JsonResponse(
                {"uuid": project.uuid, **serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
@api_view(["GET", "PUT", "DELETE"])
def project_detail(request, project_uuid):
    project = get_object_or_404(Project, pk=project_uuid)

    if request.method == "GET":
        serializer = ProjectSerializer(project)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = ProjectSerializer(project, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        project.delete()
        return JsonResponse(status=status.HTTP_204_NO_CONTENT)


@ensure_csrf_cookie
@api_view(["GET", "POST"])
def project_page_list(request, project_uuid):
    if request.method == "GET":
        project = Project.objects.get(uuid=project_uuid)
        pages = project.pages.all()
        serializer = PageSerializer(pages, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = PageSerializer(data=data)
        if serializer.is_valid():
            project = Project.objects.get(uuid=project_uuid)
            page = Page.objects.create(project=project, **serializer.validated_data)
            page.save()
            return JsonResponse(
                {"uuid": page.uuid, **serializer.data}, status=status.HTTP_201_CREATED
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
@api_view(["GET", "PUT", "DELETE"])
def project_page_detail(request, project_uuid, page_uuid):
    project = get_object_or_404(Project, pk=project_uuid)
    page = get_object_or_404(Page, pk=page_uuid)

    if page.project != project:
        return JsonResponse(status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        serializer = PageSerializer(page)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = PageSerializer(page, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        page.delete()
        return JsonResponse(status=status.HTTP_204_NO_CONTENT)
