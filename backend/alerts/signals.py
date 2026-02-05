from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import TripAlert
from system_settings.models import SystemSetting

@receiver(post_save, sender=TripAlert)
def send_alert_email(sender, instance, created, **kwargs):
    """
    Triggers an email to the admin when a HIGH or CRITICAL alert is created,
    if the 'email_alerts' system setting is enabled.
    """
    if created and instance.severity in ['HIGH', 'CRITICAL']:
        try:

            email_setting = SystemSetting.objects.filter(key='email_alerts').first()
            if email_setting and email_setting.value.lower() == 'true':

                subject = f"[Smart Drive] 🚨 {instance.severity} Alert: {instance.alert_type}"

                user_name = instance.user.username if instance.user else "Unknown User"

                location_link = f"https://www.google.com/maps/search/?api=1&query={instance.latitude},{instance.longitude}"
                if instance.latitude and instance.longitude:
                    map_url = location_link
                else:
                    map_url = "Location data unavailable"

                message = f"""
                Attention Admin,

                A new {instance.severity} alert has been detected.

                Type: {instance.alert_type}
                User: {user_name}
                Time: {instance.timestamp}
                Severity: {instance.severity}

                Location: {map_url}

                Please take necessary action.

                - Smart Drive Alert System
                """

                from_email = getattr(settings, 'EMAIL_HOST_USER', 'noreply@smartdrive.com')

                recipient_list = ['admin@smartdrive.com']

                send_mail(
                    subject,
                    message,
                    from_email,
                    recipient_list,
                    fail_silently=False,
                )
                print(f"📧 Email Alert Sent for {instance.alert_type}")

        except Exception as e:
            print(f"❌ Failed to send email alert: {e}")