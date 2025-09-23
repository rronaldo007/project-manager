from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    UserRegistrationView,
    UserProfileView,
    UserListView,
    logout_view,
    login_view,
    professional_info_view,
    update_professional_info_view
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', login_view, name='user-login'),
    path('logout/', logout_view, name='user-logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('professional-info/', professional_info_view, name='professional-info'),
    path('professional-info/update/', update_professional_info_view, name='update-professional-info'),
    path('list/', UserListView.as_view(), name='user-list'),
]