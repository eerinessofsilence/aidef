from django.urls import path
from .views import catalog, product_detail

app_name = 'main'

urlpatterns = [
    path('', catalog(), name='catalog'),  
    path('product/<slug:slug>/', product_detail(), name='product_detail'), 
]