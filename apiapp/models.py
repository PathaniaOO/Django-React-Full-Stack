from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    avatar=models.URLField(blank=True,null=True)
    bio=models.TextField(blank=True,null=True)

class Game(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    image=models.ImageField(upload_to='game_images/', blank=True, null=True)
    
    def __str__(self):
        return self.name

class Score(models.Model):
    player=models.ForeignKey(User,on_delete=models.CASCADE,db_column='player_id',null=True,blank=True)
    player_name=models.CharField(max_length=100,null=True,blank=True)
    game=models.ForeignKey(Game,on_delete=models.CASCADE,related_name='score')
    score=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering=['-score']
