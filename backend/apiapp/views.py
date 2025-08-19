from datetime import timedelta
from urllib import response

from django.contrib.auth import get_user_model
from django.db.models import F
from django.shortcuts import render
from django.utils import timezone
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import (IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apiapp import serializers

from .models import Game, Score, User
from .serializers import (LeaderboardSerializer, ProfileSerializer,
                          RegistrationSerializer, ScoreSerializer)

# Create your views here.

User=get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes=[permissions.AllowAny]

@method_decorator(ratelimit(key='user',rate='5m/s',method='POST',block=True),name='dispatch')
class SubmitScoreView(generics.CreateAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    permission_classes=[permissions.IsAuthenticated]
    
    def perform_create(self,serializer):
        game_id=self.request.data.get('game')
        try:
            game=Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            raise ValidationError({"game": "Invalid game ID"})
        
        serializer.save(player=self.request.user, game=game)

class LeaderboardView(generics.ListAPIView):
    queryset=Score.objects.all()
    serializer_class = ScoreSerializer
    permission_classes=[permissions.AllowAny]
    
class GameListCreateView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = serializers.GameSerializer
    permission_classes=[IsAuthenticatedOrReadOnly]


    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    serializer=ProfileSerializer(request.user)
    return Response(serializer.data)
    
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_score(request):
    game_id = request.data.get("game")
    if not game_id:
        return Response({"error": "Game ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        game = Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        return Response({"error": "Invalid game ID"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Replace .get() with filter().first() to avoid MultipleObjectsReturned
    score_obj = Score.objects.filter(player=request.user, game=game).order_by('-id').first()
    if not score_obj:
        score_obj = Score.objects.create(player=request.user, game=game, score=0)

    increment = request.data.get("increment")
    if increment is not None:
        score_obj.score += int(increment)
    
    new_score = request.data.get("score")
    if new_score is not None:
        score_obj.score = int(new_score)
    
    score_obj.save()

    rank = Score.objects.filter(game=game, score__gt=score_obj.score).count() + 1
    return Response({"message": "Score updated", "rank": rank, "score": score_obj.score}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def reset_score(request):
    game_id = request.data.get("game")
    if not game_id:
        return Response({"error": "Game ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        game = Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        return Response({"error": "Invalid game ID"}, status=status.HTTP_400_BAD_REQUEST)

    score_obj = Score.objects.filter(player=request.user, game=game).order_by('-id').first()
    if not score_obj:
        return Response({"error": "No score found for this game"}, status=status.HTTP_404_NOT_FOUND)
    
    score_obj.score = 0
    score_obj.save()
    return Response({"message": "Score reset to 0"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def game_leaderboard(request, game_id):
    try:
        game = Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        return Response({"error": "Game not found"}, status=404)

    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 10))
    period = request.query_params.get('period')
    order = request.query_params.get('order', 'desc')

    scores = Score.objects.filter(game=game)

    now = timezone.now()
    if period == "daily":
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow_start = today_start + timedelta(days=1)
        scores = scores.filter(created_at__gte=today_start, created_at__lt=tomorrow_start)
    elif period == "weekly":
        week_ago = now - timedelta(days=7)
        scores = scores.filter(created_at__gte=week_ago)
    elif period == "monthly":
        month_ago = now - timedelta(days=30)
        scores = scores.filter(created_at__gte=month_ago)

    if order == 'asc':
        scores = scores.order_by('score')
    else:
        scores = scores.order_by('-score')

    # Pagination
    start = (page - 1) * page_size
    end = start + page_size
    paginated_scores = scores[start:end]

    serializer = LeaderboardSerializer(paginated_scores, many=True)

    response_data = {
        "game": game.name,
        "page": page,
        "page_size": page_size,
        "total_scores": scores.count(),
        "scores": serializer.data,
    }

    # Optional: show logged-in user's real score if exists
    if request.user.is_authenticated:
        user_score = scores.filter(player=request.user).order_by('-score').first()
        if user_score:
            user_rank = scores.filter(score__gt=user_score.score).count() + 1
            response_data['your_score'] = {
                "username": user_score.player.username,
                "score": user_score.score,
                "rank": user_rank
            }

    return Response(response_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token=request.data["refresh"]
        token=RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        print("Logout error:", str(e))
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
            