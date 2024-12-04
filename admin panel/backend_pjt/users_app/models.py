from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")  
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)   
    phone_number = models.CharField(max_length=15, null=True, blank=True)   
    blocked = models.BooleanField(default=False) 


    def __str__(self):
        return self.user.username