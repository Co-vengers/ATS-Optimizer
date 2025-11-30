from django.urls import path
from .views import ATSScoreView

urlpatterns = [
    path("calculate-score/", ATSScoreView.as_view(), name="ats-score"),
]