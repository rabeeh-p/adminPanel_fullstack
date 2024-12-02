from django.urls import path
from . import views

urlpatterns = [
    path('',views.hello_world ),
    path('signup/',views.user_signup ),
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    path('user-home/', views.get_user_details, name='user-home'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('admin/users/', views.UserListView.as_view(), name='user-list'),
    
]

