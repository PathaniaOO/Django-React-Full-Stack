from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Score,User,Game
from django.db.models import Max

User=get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    best_score=serializers.SerializerMethodField()
    total_games=serializers.SerializerMethodField()
    
    class Meta:
        model=User
        fields=['username','email','avatar','bio','date_joined','best_score','total_games']
    
    def get_best_score(self, obj):
        scores = obj.score_set.all()
        return scores.aggregate(best=Max('score'))['best'] or 0

    def get_total_games(self, obj):
        return obj.score_set.count()

    

class RegistrationSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    email=serializers.EmailField(required=False, allow_blank=True)
    class Meta:
        model=User
        fields=['username','email','password']
    
    def create(self, validated_data):
        user=User(username=validated_data['username'],email=validated_data.get('email',''))
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model=Game
        fields=['id','name','description','created_at','image']
    
class ScoreSerializer(serializers.ModelSerializer):
    player=serializers.StringRelatedField(read_only=True)
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.all(), required=False)
    score = serializers.IntegerField(required=False)

    
    class Meta:
        model=Score
        fields = ['id', 'score', 'player','player_name','game', 'created_at']
        read_only_fields = ['id', 'player','player_name','created_at']

class LeaderboardSerializer(serializers.ModelSerializer):
    username=serializers.SerializerMethodField()
    
    class Meta:
        model=Score
        fields=('username','score')
        
    def get_username(self, obj):
        if getattr(obj, 'player_name', None):
            return obj.player_name
        elif obj.player:
            return obj.player.username
        return "Unknown Player"
            
        
        
        
