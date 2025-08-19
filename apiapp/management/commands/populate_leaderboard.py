import random
from django.core.management.base import BaseCommand
from apiapp.models import Game,Score

class Command(BaseCommand):
    help = 'Populate leaderboard with 50 players per game using real names, with game-specific score ranges'

    def handle(self, *args, **kwargs):
        games = Game.objects.all()

        player_names = [
            "Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack",
            "Kathy", "Leo", "Mona", "Nate", "Olivia", "Paul", "Quinn", "Rachel", "Steve", "Tina",
            "Uma", "Victor", "Wendy", "Xander", "Yara", "Zane", "Aaron", "Bella", "Cody", "Diana",
            "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Mike", "Nina",
            "Oscar", "Paula", "Quincy", "Rita", "Sam", "Tracy", "Ulysses", "Vera", "Will", "Yvonne"
        ]

        # Define custom score ranges for each game (min, max)
        game_score_ranges = {
            "Chess": (100, 500),
            "Sudoku": (50, 400),
            "Tetris": (80, 600),
            "Pac-Man": (70, 550),
        }
        
        for game in games:
            # Clear old scores
            Score.objects.filter(game=game,player__isnull=True).delete()

            min_score, max_score = game_score_ranges.get(game.name, (50, 500))

            for name in player_names:
                score = random.randint(min_score, max_score)
                Score.objects.create(player=None, player_name=name, game=game, score=score)

            self.stdout.write(self.style.SUCCESS(f"Populated {game.name} with 50 players"))

        self.stdout.write(self.style.SUCCESS("All leaderboards populated successfully!"))