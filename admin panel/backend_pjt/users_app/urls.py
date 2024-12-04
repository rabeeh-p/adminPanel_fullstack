from django.urls import path
from . import views

urlpatterns = [
    path('',views.hello_world ),
    path('signup/',views.user_signup ),
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    path('user-home/', views.get_user_details, name='user-home'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('users-list/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:userId>/', views.UserDetailView.as_view(), name='user-detail'),
    path('block-unblock-user/<int:user_id>/', views.BlockUnblockUserView.as_view(), name='block-unblock-user'),
    path('user-update/', views.edit_user, name='user-update'),
    path('add-user/', views.add_user, name='add-user'),
    path('users/edit/<int:user_id>/', views.EditUserDetails.as_view(), name='edit-user'),
    
]

