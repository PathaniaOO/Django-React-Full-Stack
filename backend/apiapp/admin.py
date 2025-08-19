from django.contrib import admin
from .models import User, Game, Score
# Register your models here.

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff')
    search_fields = ('username', 'email')

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('player', 'game', 'score', 'created_at')
    list_filter = ('game','created_at')
    search_fields = ('player__username', 'game__name')
    ordering = ('-created_at',)

