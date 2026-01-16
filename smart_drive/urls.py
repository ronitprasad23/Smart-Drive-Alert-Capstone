from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.routers import DefaultRouter
from accounts.views import RegisterView, AdminLoginView, UserProfileView, EmergencyContactViewSet, AdminLoginView
# AdminLoginView name conflict in my previous thought, I defined it once.
from accounts.views import * 
from vehicles.views import VehicleViewSet
from trips.views import TripViewSet
from alerts.views import UserAlertViewSet, AdminAlertViewSet
from system_settings.views import SystemSettingViewSet
from analytics.views import OverviewView, AlertsSummaryView, RiskTrendsView, TripFeedbackView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

# Routers for ViewSets
user_router = DefaultRouter()
user_router.register(r'vehicles', VehicleViewSet, basename='user-vehicles')
user_router.register(r'emergency-contacts', EmergencyContactViewSet, basename='user-emergency-contacts')
# trips
# alerts

# We can't easily mix 'user/trips' in the same router if we want flat structure, but we can.
# Actually, the spec says /api/user/vehicles/ (List/Create)
# ViewSets provide list/create/retrieve/update/destroy.
# To match /api/user/vehicles/, we can route the viewset to 'api/user'.

# Let's try to be precise with paths.

urlpatterns = [
    path('admin/', admin.site.urls), # Django Admin

    # Auth
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='login'),
    # path('api/auth/admin/login/', AdminLoginView.as_view(), name='admin-login'), # Placeholder
    path('api/auth/admin/login/', AdminLoginView.as_view(), name='admin-login'),

    # User APIs - Explicit paths or ViewSets
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # ViewSets often need a router or manual bindings.
    # Manual bindings for clarity:
    path('api/user/vehicles/', VehicleViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-vehicles-list'),
    path('api/user/vehicles/<int:pk>/', VehicleViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='user-vehicles-detail'),

    path('api/user/emergency-contacts/', EmergencyContactViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-contacts-list'),
    path('api/user/emergency-contacts/<int:pk>/', EmergencyContactViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='user-contacts-detail'),

    path('api/user/trips/', TripViewSet.as_view({'get': 'list'}), name='user-trips-list'),
    path('api/user/trips/<int:pk>/', TripViewSet.as_view({'get': 'retrieve'}), name='user-trips-detail'),

    path('api/user/alerts/', UserAlertViewSet.as_view({'get': 'list'}), name='user-alerts-list'),
    path('api/user/alerts/<int:pk>/', UserAlertViewSet.as_view({'get': 'retrieve'}), name='user-alerts-detail'),

    # Admin APIs
    path('api/admin/dashboard/', OverviewView.as_view(), name='admin-dashboard'), # Same as analytics overview? Spec lists both? 
    # "GET /api/admin/dashboard/" and "GET /api/analytics/overview/".
    # I'll point both to OverviewView or similar.
    
    # "GET /api/admin/users/"
    # Need a UserViewSet for admin.
    path('api/admin/users/', AdminUserViewSet.as_view({'get': 'list'}), name='admin-users-list'),
    path('api/admin/users/<int:pk>/', AdminUserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}), name='admin-users-detail'),
    path('api/admin/users/<int:pk>/status/', AdminUserViewSet.as_view({'patch': 'partial_update'}), name='admin-users-status'), # Alias for partial update

    
    path('api/admin/alerts/', AdminAlertViewSet.as_view({'get': 'list'}), name='admin-alerts-list'),
    
    path('api/admin/system-settings/', SystemSettingViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-settings-list'),
    path('api/admin/system-settings/<int:pk>/', SystemSettingViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='admin-settings-detail'),

    # Analytics APIs
    path('api/analytics/overview/', OverviewView.as_view(), name='analytics-overview'),
    path('api/analytics/alerts-summary/', AlertsSummaryView.as_view(), name='analytics-alerts-summary'),
    path('api/analytics/risk-trends/', RiskTrendsView.as_view(), name='analytics-risk-trends'),
    path('api/analytics/trip-feedback/<int:trip_id>/', TripFeedbackView.as_view(), name='analytics-trip-feedback'),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
