from django.urls import path

from .api import item_detail_api, item_list_api
from .views import catalog, product_detail

app_name = 'main'

urlpatterns = [
    path('', catalog, name='catalog'),
    path('product/<slug:slug>/', product_detail, name='product_detail'),
    path('api/items/', item_list_api, name='item-list'),
    path('api/items/<int:pk>/', item_detail_api, name='item-detail'),
]