from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apiapp.models import Game, Score
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates application data'
    
    def handle(self, *args, **kwargs):
        admin_user=User.objects.filter(username='admin').first()
        if not admin_user:
            admin_user = User.objects.create_superuser(username='admin', password='password')
            self.stdout.write(self.style.SUCCESS(f"Created superuser: {user.username}"))
            
        regular_usernames=['alice','bob','carol','dave','eve']
        regular_users=[]
        for username in regular_usernames:
            user_obj=User.objects.filter(username=username).first()
            if not user_obj:
                user_obj=User.objects.create_user(username=username, password='test')
            regular_users.append(user_obj)
            self.stdout.write(self.style.SUCCESS(f"Created user: {user_obj.username}"))
        
        
        games_data = [
            {"name": "Chess", "description": "Classic board game"},
            {"name": "Sudoku", "description": "Number puzzle game"},
            {"name": "Tetris", "description": "Block puzzle game"},
            {"name": "Pac-Man", "description": "Arcade maze game"},
        ]
        
        games=[Game(name=g["name"],description=g["description"])for g in games_data]
        Game.objects.bulk_create(games)
        games=Game.objects.all()
        
        all_users=[admin_user]+regular_users
        score_to_create=[]
        for user_obj in all_users:
            for game in games:
                score_value=random.randint(100,400)
                score_to_create.append(Score(player=user_obj,game=game,score=score_value))
        
        Score.objects.bulk_create(score_to_create)
        self.stdout.write(self.style.SUCCESS('Application data created'))
            

    
        