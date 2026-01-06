#!/usr/bin/env python
import argparse
import os
import sys
from pathlib import Path


def setup_django() -> None:
    base_dir = Path(__file__).resolve().parents[1]
    if str(base_dir) not in sys.path:
        sys.path.insert(0, str(base_dir))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "aidef.settings")
    import django

    django.setup()


setup_django()

from django.core.management.color import no_style
from django.db import connections
from django.utils import timezone
from django.utils.text import slugify

from main.models import (
    Category,
    Product,
    ProductCTABlock,
    ProductFeature,
    ProductFeatureBlock,
    ProductGallery as MainProductGallery,
    ProductImage as MainProductImage,
    ProductInfoBlock,
    ProductSubFeature,
    ProductTechnology,
)
from portal.models import (
    PortalProduct,
    ProductCharacteristic,
    ProductCharacteristicsBlock,
    ProductGallery as PortalProductGallery,
    ProductImage as PortalProductImage,
    ProductModule,
    ProductModuleCharacteristic,
    ProductModuleImage,
    ProductModulePlacement,
    ProductModulesBlock,
    ProductPresentationInfo,
    ProductTextBlock,
)

MAIN_MODELS = [
    Category,
    Product,
    MainProductImage,
    ProductFeature,
    ProductSubFeature,
    MainProductGallery,
    ProductTechnology,
    ProductFeatureBlock,
    ProductInfoBlock,
    ProductCTABlock,
]

PORTAL_MODELS = [
    PortalProduct,
    ProductCharacteristicsBlock,
    ProductCharacteristic,
    ProductModulesBlock,
    ProductModule,
    ProductModuleCharacteristic,
    ProductModuleImage,
    ProductModulePlacement,
    PortalProductImage,
    PortalProductGallery,
    ProductPresentationInfo,
    ProductTextBlock,
]

MODEL_GROUPS = {
    "main": MAIN_MODELS,
    "portal": PORTAL_MODELS,
}

UNIQUE_FIELDS = {
    Category: ("name", "name_en", "name_de", "name_sk", "slug"),
    Product: ("slug",),
    PortalProduct: ("slug",),
}


def is_blank(value) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    return False


def ensure_unique_value(
    value,
    used: set,
    base_value,
    max_length=None,
    separator: str = "-",
) -> str:
    candidate = value
    if is_blank(candidate):
        candidate = base_value
    if candidate is None:
        candidate = ""
    if isinstance(candidate, str):
        candidate = candidate.strip()
    candidate = str(candidate)
    if max_length:
        candidate = candidate[:max_length]
    if candidate not in used:
        used.add(candidate)
        return candidate
    counter = 1
    while True:
        suffix = f"{separator}{counter}"
        if max_length:
            trimmed = candidate[: max_length - len(suffix)]
        else:
            trimmed = candidate
        new_value = f"{trimmed}{suffix}"
        if new_value not in used:
            used.add(new_value)
            return new_value
        counter += 1


def ensure_unique_across(
    value,
    used_sets: list[set],
    base_value,
    max_length=None,
    separator: str = "-",
) -> str:
    combined = set()
    for used in used_sets:
        combined.update(used)
    candidate = ensure_unique_value(
        value,
        combined,
        base_value,
        max_length=max_length,
        separator=separator,
    )
    for used in used_sets:
        used.add(candidate)
    return candidate


def init_unique_trackers(model, use_existing: bool) -> dict[str, set]:
    fields = UNIQUE_FIELDS.get(model)
    if not fields:
        return {}
    trackers: dict[str, set] = {}
    for field_name in fields:
        if use_existing:
            values = model.objects.using("default").values_list(field_name, flat=True)
            trackers[field_name] = {value for value in values if not is_blank(value)}
        else:
            trackers[field_name] = set()
    return trackers


def normalize_category(data: dict, trackers: dict[str, set]) -> None:
    name_field = Category._meta.get_field("name")
    slug_field = Category._meta.get_field("slug")
    pk = data.get("id")

    raw_name_en = data.get("name_en")
    raw_name = data.get("name")
    base_name = raw_name_en if not is_blank(raw_name_en) else raw_name
    if is_blank(base_name):
        base_name = f"Category {pk}" if pk is not None else "Category"

    name_used_sets = [trackers["name"]]
    if "name_en" in trackers:
        name_used_sets.append(trackers["name_en"])

    name = ensure_unique_across(
        raw_name_en if not is_blank(raw_name_en) else raw_name,
        name_used_sets,
        base_name,
        max_length=name_field.max_length,
        separator=" ",
    )
    data["name"] = name
    if "name_en" in data:
        data["name_en"] = name

    for field_name in ("name_de", "name_sk"):
        if field_name not in data:
            continue
        value = data.get(field_name)
        if is_blank(value):
            data[field_name] = None
            continue
        tracker = trackers.get(field_name)
        if tracker is None:
            continue
        field = Category._meta.get_field(field_name)
        data[field_name] = ensure_unique_value(
            value,
            tracker,
            value,
            max_length=field.max_length,
            separator=" ",
        )

    raw_slug = data.get("slug")
    base_slug = raw_slug
    if is_blank(base_slug):
        base_slug = slugify(name)
    if is_blank(base_slug):
        base_slug = f"category-{pk}" if pk is not None else "category"

    slug = ensure_unique_value(
        raw_slug,
        trackers["slug"],
        base_slug,
        max_length=slug_field.max_length,
        separator="-",
    )
    data["slug"] = slug


def normalize_product(data: dict, trackers: dict[str, set]) -> None:
    slug_field = Product._meta.get_field("slug")
    pk = data.get("id")

    raw_slug = data.get("slug")
    base_slug = raw_slug
    if is_blank(base_slug):
        name = data.get("name_en") or data.get("name")
        if not is_blank(name):
            base_slug = slugify(name)
    if is_blank(base_slug):
        base_slug = f"product-{pk}" if pk is not None else "product"

    slug = ensure_unique_value(
        raw_slug,
        trackers["slug"],
        base_slug,
        max_length=slug_field.max_length,
        separator="-",
    )
    data["slug"] = slug


def normalize_portal_product(data: dict, trackers: dict[str, set]) -> None:
    slug_field = PortalProduct._meta.get_field("slug")
    pk = data.get("id")

    raw_slug = data.get("slug")
    base_slug = raw_slug
    if is_blank(base_slug):
        name = data.get("name_en") or data.get("name")
        if not is_blank(name):
            base_slug = slugify(name)
    if is_blank(base_slug):
        base_slug = f"portal-product-{pk}" if pk is not None else "portal-product"

    slug = ensure_unique_value(
        raw_slug,
        trackers["slug"],
        base_slug,
        max_length=slug_field.max_length,
        separator="-",
    )
    data["slug"] = slug


MODEL_NORMALIZERS = {
    Category: normalize_category,
    Product: normalize_product,
    PortalProduct: normalize_portal_product,
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Restore data from the 'old' database into the default one."
    )
    parser.add_argument(
        "--groups",
        default="main,portal",
        help="Comma-separated groups to restore: main, portal.",
    )
    parser.add_argument(
        "--truncate",
        action="store_true",
        help="Delete existing rows for selected models before copying.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Scan and report without writing to the default database.",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=500,
        help="Rows per batch when copying.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Fail on conflicts instead of skipping existing rows.",
    )
    return parser.parse_args()


def resolve_groups(raw_value: str) -> list[str]:
    groups = [item.strip().lower() for item in raw_value.split(",") if item.strip()]
    unknown = [group for group in groups if group not in MODEL_GROUPS]
    if unknown:
        raise SystemExit(f"Unknown group(s): {', '.join(unknown)}")
    return groups


def build_model_list(groups: list[str]) -> list[type]:
    ordered_groups = ["main", "portal"]
    models: list[type] = []
    seen: set[type] = set()

    def add(model: type) -> None:
        if model not in seen:
            models.append(model)
            seen.add(model)

    if "portal" in groups and "main" not in groups:
        add(Category)

    for group in ordered_groups:
        if group in groups:
            for model in MODEL_GROUPS[group]:
                add(model)

    return models


def get_table_columns(connection, table_name: str) -> set[str]:
    with connection.cursor() as cursor:
        description = connection.introspection.get_table_description(cursor, table_name)
    return {column.name for column in description}


def build_copy_plan(model, table_columns: set[str]):
    columns: list[str] = []
    column_to_attname: dict[str, str] = {}
    fallbacks: dict[str, callable] = {}
    missing_required: list[str] = []

    for field in model._meta.fields:
        column = field.column
        attname = field.attname
        if column in table_columns:
            columns.append(column)
            column_to_attname[column] = attname
            continue
        if field.primary_key:
            missing_required.append(field.name)
            continue
        if getattr(field, "auto_now", False) or getattr(field, "auto_now_add", False):
            fallbacks[attname] = timezone.now
            continue
        if field.has_default():
            fallbacks[attname] = field.get_default
            continue
        if field.null:
            fallbacks[attname] = lambda: None
            continue
        missing_required.append(field.name)

    if missing_required:
        missing_list = ", ".join(missing_required)
        raise RuntimeError(
            f"{model._meta.label} is missing required columns in the old database: {missing_list}"
        )

    return columns, column_to_attname, fallbacks


def copy_model(
    model,
    old_connection,
    table_columns: set[str],
    batch_size: int,
    dry_run: bool,
    ignore_conflicts: bool,
    normalizer=None,
    unique_trackers=None,
) -> int:
    if unique_trackers is None:
        unique_trackers = {}
    columns, column_to_attname, fallbacks = build_copy_plan(model, table_columns)
    if not columns:
        return 0

    quote = old_connection.ops.quote_name
    select_sql = "SELECT {cols} FROM {table}".format(
        cols=", ".join(quote(column) for column in columns),
        table=quote(model._meta.db_table),
    )

    total = 0
    with old_connection.cursor() as cursor:
        cursor.execute(select_sql)
        while True:
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break
            objects = []
            for row in rows:
                data = {}
                for column, value in zip(columns, row):
                    data[column_to_attname[column]] = value
                for attname, fallback in fallbacks.items():
                    if attname not in data:
                        data[attname] = fallback()
                if normalizer is not None:
                    normalizer(data, unique_trackers)
                objects.append(model(**data))
            if objects and not dry_run:
                model.objects.using("default").bulk_create(
                    objects,
                    batch_size=batch_size,
                    ignore_conflicts=ignore_conflicts,
                )
            total += len(objects)
    return total


def truncate_models(models: list[type]) -> None:
    for model in reversed(models):
        model.objects.using("default").all().delete()


def reset_sequences(models: list[type]) -> None:
    connection = connections["default"]
    sql_list = connection.ops.sequence_reset_sql(no_style(), models)
    if not sql_list:
        return
    with connection.cursor() as cursor:
        for statement in sql_list:
            cursor.execute(statement)


def main() -> None:
    args = parse_args()
    groups = resolve_groups(args.groups)
    models = build_model_list(groups)

    if "old" not in connections.databases:
        raise SystemExit("DATABASES['old'] is not configured in settings.")

    old_connection = connections["old"]
    old_tables = set(old_connection.introspection.table_names())
    ignore_conflicts = not args.strict and not args.truncate

    if args.truncate and not args.dry_run:
        print("Truncating existing data...")
        truncate_models(models)

    use_existing = not args.truncate
    model_trackers = {
        model: init_unique_trackers(model, use_existing)
        for model in models
        if model in UNIQUE_FIELDS
    }

    totals: dict[str, int] = {}
    for model in models:
        table = model._meta.db_table
        if table not in old_tables:
            print(f"Skipping {model._meta.label}: missing table {table}.")
            continue
        table_columns = get_table_columns(old_connection, table)
        normalizer = MODEL_NORMALIZERS.get(model)
        unique_trackers = model_trackers.get(model)
        print(f"Copying {model._meta.label}...")
        totals[model._meta.label] = copy_model(
            model,
            old_connection,
            table_columns,
            batch_size=max(1, args.batch_size),
            dry_run=args.dry_run,
            ignore_conflicts=ignore_conflicts,
            normalizer=normalizer,
            unique_trackers=unique_trackers,
        )

    if not args.dry_run:
        reset_sequences(models)

    if totals:
        print("Done.")
        for label, count in totals.items():
            print(f"{label}: {count} rows processed.")


if __name__ == "__main__":
    main()
