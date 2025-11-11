from django.urls import path

from .api import item_detail_api, item_list_api

app_name = 'main'

urlpatterns = [
    path('api/items/', item_list_api, name='item-list'),
    path('api/items/<slug:slug>/', item_detail_api, name='item-detail'),
]