from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    InspectionFormViewSet, register_user, login_user, 
    get_user_profile, update_user_profile, submit_form, 
    update_form, download_form_pdf, download_form_excel
)

router = DefaultRouter()
router.register(r'forms', InspectionFormViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Authentication
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/profile/', get_user_profile, name='profile'),
    path('auth/profile/update/', update_user_profile, name='update-profile'),
    
    # JWT Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Form operations
    path('submit-form/', submit_form, name='submit-form'),
    path('update-form/<int:pk>/', update_form, name='update-form'),
    path('download-pdf/<int:pk>/', download_form_pdf, name='download-form-pdf'),
    path('download-excel/<int:pk>/', download_form_excel, name='download-form-excel'),
]