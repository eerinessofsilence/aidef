from django.urls import path

from .api import portal_product_detail_api, portal_product_list_api

app_name = "portal"

urlpatterns = [
    path(
        "api/portal/products/",
        portal_product_list_api,
        name="portal-product-list",
    ),
    path(
        "api/portal/products/<slug:slug>/",
        portal_product_detail_api,
        name="portal-product-detail",
    ),
]
