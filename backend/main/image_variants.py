from __future__ import annotations

import os
import posixpath
from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image, ImageOps, UnidentifiedImageError

MENU_VARIANT_WIDTH = 512
MENU_VARIANT_HEIGHT = 320
MENU_VARIANT_QUALITY = 76


def build_menu_image_url(request, image_field) -> str | None:
    return build_webp_variant_url(
        request,
        image_field,
        profile="menu",
        max_width=MENU_VARIANT_WIDTH,
        max_height=MENU_VARIANT_HEIGHT,
        quality=MENU_VARIANT_QUALITY,
    )


def build_webp_variant_url(
    request,
    image_field,
    *,
    profile: str,
    max_width: int,
    max_height: int,
    quality: int,
) -> str | None:
    original_url = _build_absolute_url(request, image_field)
    if not original_url:
        return None

    storage = getattr(image_field, "storage", None)
    source_name = getattr(image_field, "name", "")
    if storage is None or not source_name:
        return original_url

    variant_name = _build_variant_name(
        source_name,
        profile=profile,
        max_width=max_width,
        max_height=max_height,
    )

    if _variant_is_fresh(storage, source_name, variant_name):
        return request.build_absolute_uri(storage.url(variant_name))

    try:
        with storage.open(source_name, "rb") as source_file:
            image = Image.open(source_file)
            image.load()
    except (FileNotFoundError, OSError, UnidentifiedImageError, ValueError):
        return original_url

    try:
        image = ImageOps.exif_transpose(image)
        image = _normalize_mode(image)
        image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

        buffer = BytesIO()
        image.save(
            buffer,
            format="WEBP",
            quality=quality,
            method=6,
        )
        buffer.seek(0)

        if storage.exists(variant_name):
            storage.delete(variant_name)

        saved_name = storage.save(variant_name, ContentFile(buffer.getvalue()))
    except (OSError, ValueError):
        return original_url

    return request.build_absolute_uri(storage.url(saved_name))


def _normalize_mode(image: Image.Image) -> Image.Image:
    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    target_mode = "RGBA" if has_alpha else "RGB"
    if image.mode == target_mode:
        return image
    return image.convert(target_mode)


def _build_absolute_url(request, image_field) -> str | None:
    if not image_field:
        return None
    try:
        url = image_field.url
    except (ValueError, AttributeError):
        return None
    return request.build_absolute_uri(url)


def _build_variant_name(
    source_name: str,
    *,
    profile: str,
    max_width: int,
    max_height: int,
) -> str:
    directory, filename = posixpath.split(source_name)
    stem, _ = posixpath.splitext(filename)
    variant_filename = (
        f"{stem}__{profile}-{max_width}x{max_height}.webp"
    )
    return posixpath.join(directory, "_variants", variant_filename)


def _variant_is_fresh(storage, source_name: str, variant_name: str) -> bool:
    if not storage.exists(variant_name):
        return False

    try:
        source_path = storage.path(source_name)
        variant_path = storage.path(variant_name)
    except (AttributeError, NotImplementedError, ValueError):
        return True

    try:
        return os.path.getmtime(variant_path) >= os.path.getmtime(source_path)
    except OSError:
        return False
