from django.db import migrations


def seed_swift_x8(apps, schema_editor):
    CivilCategory = apps.get_model('main', 'CivilCategory')
    CivilProduct = apps.get_model('main', 'CivilProduct')
    CivilProductFeature = apps.get_model('main', 'CivilProductFeature')
    CivilProductSubFeature = apps.get_model('main', 'CivilProductSubFeature')
    CivilProductTechnology = apps.get_model('main', 'CivilProductTechnology')
    CivilProductFeatureBlock = apps.get_model('main', 'CivilProductFeatureBlock')
    CivilProductInfoBlock = apps.get_model('main', 'CivilProductInfoBlock')
    CivilProductCTABlock = apps.get_model('main', 'CivilProductCTABlock')

    category, _ = CivilCategory.objects.get_or_create(
        slug='civil-high-speed-drone',
        defaults={'name': 'Civil High-Speed Drone'},
    )

    product, created = CivilProduct.objects.get_or_create(
        slug='swift-x8',
        defaults={
            'name': 'Swift X8',
            'description': (
                'Swift X8 is a high-speed civil drone for time-critical '
                'monitoring, rapid response, and long-distance '
                'infrastructure inspection.'
            ),
            'category': category,
            'available': True,
            'order': 1,
        },
    )

    if not created:
        return

    CivilProductFeature.objects.bulk_create(
        [
            CivilProductFeature(
                product=product,
                name='Top Speed',
                value='185 km/h',
                description='Designed for urgent civilian missions.',
                order=1,
            ),
            CivilProductFeature(
                product=product,
                name='Range',
                value='120 km',
                description='Covers long linear assets in a single sortie.',
                order=2,
            ),
            CivilProductFeature(
                product=product,
                name='Flight Time',
                value='52 min',
                description='Stable performance during long operations.',
                order=3,
            ),
            CivilProductFeature(
                product=product,
                name='Payload',
                value='4.5 kg',
                description='Supports camera, thermal, and mapping modules.',
                order=4,
            ),
        ]
    )

    CivilProductSubFeature.objects.bulk_create(
        [
            CivilProductSubFeature(
                product=product,
                name='Fast VTOL Transition',
                description='Quick climb and conversion to forward flight mode.',
                order=1,
            ),
            CivilProductSubFeature(
                product=product,
                name='Civil Geofencing',
                description='Configurable safety zones for urban operations.',
                order=2,
            ),
            CivilProductSubFeature(
                product=product,
                name='Stabilized Imaging',
                description='Steady capture at high velocity and crosswinds.',
                order=3,
            ),
            CivilProductSubFeature(
                product=product,
                name='Rapid Turnaround',
                description='Field serviceability with minimal setup time.',
                order=4,
            ),
        ]
    )

    CivilProductTechnology.objects.bulk_create(
        [
            CivilProductTechnology(
                product=product,
                name='High-Speed Navigation Core',
                description=(
                    'Predictive routing keeps the platform stable and '
                    'efficient at high velocity.'
                ),
                tags=['Civil', 'Autonomy', 'Navigation'],
                order=1,
            ),
            CivilProductTechnology(
                product=product,
                name='Edge Video Processing',
                description=(
                    'Real-time object and anomaly detection for rapid '
                    'operational decisions.'
                ),
                tags=['AI', 'Vision', 'Realtime'],
                order=2,
            ),
            CivilProductTechnology(
                product=product,
                name='Mission Safety Layer',
                description=(
                    'Redundant control and emergency return behavior for '
                    'civilian deployments.'
                ),
                tags=['Safety', 'Compliance'],
                order=3,
            ),
        ]
    )

    CivilProductFeatureBlock.objects.bulk_create(
        [
            CivilProductFeatureBlock(
                product=product,
                name='Speed Without Compromise',
                title='Move faster, inspect earlier, react sooner.',
                description=(
                    'Swift X8 reduces response latency for municipal '
                    'operations, utility inspections, and emergency '
                    'coordination.'
                ),
                with_logo=False,
                order=1,
            ),
            CivilProductFeatureBlock(
                product=product,
                name='Civil Operations Ready',
                title='Built for everyday non-military field work.',
                description=(
                    'The platform is configured around civil safety, '
                    'predictable maintenance, and operator-friendly workflows.'
                ),
                with_logo=True,
                order=2,
            ),
        ]
    )

    CivilProductInfoBlock.objects.create(
        product=product,
        title_1='One platform for urgent civil missions.',
        description_1=[
            'Quick launch sequence in constrained environments',
            'High-speed coverage of roads, rails, and utility lines',
            'Reliable telemetry for command teams',
        ],
        title_2='Data that reaches teams while it still matters.',
        description_2=[
            'Near real-time imagery pipeline',
            'Clean export to existing GIS and planning systems',
            'Structured logs for audit and compliance workflows',
        ],
        order=1,
    )

    CivilProductCTABlock.objects.create(
        product=product,
        name='Demo Program',
        title='Request a Swift X8 civil mission demo.',
        has_button=True,
        order=1,
    )


def unseed_swift_x8(apps, schema_editor):
    CivilProduct = apps.get_model('main', 'CivilProduct')
    CivilCategory = apps.get_model('main', 'CivilCategory')

    CivilProduct.objects.filter(slug='swift-x8').delete()
    CivilCategory.objects.filter(slug='civil-high-speed-drone').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0030_civilcategory_civilproduct_civilproductctablock_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_swift_x8, unseed_swift_x8),
    ]
