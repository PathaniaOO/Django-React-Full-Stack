from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, SubmitScoreView, LeaderboardView,GameListCreateView
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', views.my_profile, name='my-profile'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('game/', GameListCreateView.as_view(), name='game-list-create'),
    path('leaderboard/<int:game_id>/', views.game_leaderboard, name='game-leaderboard'),
    path('score/', SubmitScoreView.as_view(), name='submit_score'),
    path('score/update/', views.update_score, name='update_score'),
    path('score/reset/', views.reset_score, name='reset_score'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('logout/', views.logout_view, name='logout')

]
