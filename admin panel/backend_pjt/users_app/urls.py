from django.urls import path
from . import views

urlpatterns = [
    path('',views.hello_world ),
    path('signup/',views.user_signup ),
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    
]
