from rest_framework import generics, status, viewsets, permissions, mixins, serializers
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Project, Task, Comment
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ProjectSerializer, TaskSerializer, \
    CommentSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class UserViewSet(viewsets.GenericViewSet,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def retrieve(self, request, *args, **kwargs):
        if int(kwargs['pk']) != request.user.id:
            return Response({"detail": "Not allowed."}, status=403)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if int(kwargs['pk']) != request.user.id:
            return Response({"detail": "Not allowed."}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if int(kwargs['pk']) != request.user.id:
            return Response({"detail": "Not allowed."}, status=403)
        return super().destroy(request, *args, **kwargs)

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]  # Use IsAuthenticated if IsOwner not used

    def get_queryset(self):
        # Return only projects owned by current user
        return Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign logged-in user as the project owner
        serializer.save(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')  # from nested route
        if project_id:
            try:
                project = Project.objects.get(id=project_id, owner=self.request.user)
            except Project.DoesNotExist:
                raise NotFound("Project not found or access denied.")
            return Task.objects.filter(project=project)
        return Task.objects.filter(project__owner=self.request.user)

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_pk')
        if not project_id:
            raise serializers.ValidationError({'project': 'Project ID is required in URL.'})
        try:
            project = Project.objects.get(id=project_id, owner=self.request.user)
        except Project.DoesNotExist:
            raise NotFound("Project not found or access denied.")
        serializer.save(project=project)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')  # nested
        if task_id:
            return Comment.objects.filter(task__id=task_id, task__project__owner=self.request.user)
        return Comment.objects.filter(task__project__owner=self.request.user)

    def perform_create(self, serializer):
        task_id = self.kwargs.get('task_pk')
        try:
            task = Task.objects.get(id=task_id, project__owner=self.request.user)
        except Task.DoesNotExist:
            raise NotFound("Task not found or access denied.")
        serializer.save(task=task, user=self.request.user)
