from django.urls import path
from .views import BoulderView, BoulderProcessView, BoulderSummarizeView


"""
POST   /boulder/process/          - Upload image → detect holds
GET    /boulder/<id>/             - Retrieve stored boulder info
POST   /boulder/<id>/summarize/   - Run LLM summarization
"""
urlpatterns = [
    path('<int:id>/', BoulderView.as_view(), name='boulder-detail'),
    path('process/', BoulderProcessView.as_view(), name='boulder-process'),
    path('<int:id>/summarize/', BoulderSummarizeView.as_view(), name='boulder-summarize'),  # noqa: 501
]
