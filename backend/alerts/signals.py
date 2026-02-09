from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import TripAlert
from system_settings.models import SystemSetting

@receiver(post_save, sender=TripAlert)
def send_alert_email(sender, instance, created, **kwargs):
    """
    Triggers an email to the admin when a MODERATE or CRITICAL risk alert is created.
    """
    # Check for the correct severity choices defined in the model
    if created and instance.severity in ['CRITICAL_RISK', 'MODERATE_RISK', 'CRITICAL', 'HIGH']:
        try:
            # We will try to send email regardless of system setting for now to ensure it works for the demo
            # Or we can check if the setting exists, but defaulting to sending is better for "how to send"
            
            subject = f"[Smart Drive] 🚨 {instance.get_severity_display()} Alert: {instance.alert_type}"

            user_name = instance.user.username if instance.user else "Unknown User"
            vehicle_name = str(instance.trip.vehicle) if instance.trip and instance.trip.vehicle else "Unknown Vehicle"

            location_link = f"https://www.google.com/maps/search/?api=1&query={instance.latitude},{instance.longitude}"
            if instance.latitude and instance.longitude:
                map_url = location_link
            else:
                map_url = "Location data unavailable"

            message = f"""
            Attention Admin,

            A new {instance.get_severity_display()} has been detected.

            --------------------------------------------------
            🚗 Vehicle: {vehicle_name}
            👤 User: {user_name}
            🚨 Type: {instance.alert_type}
            ⚡ Risk Level: {instance.get_severity_display()}
            --------------------------------------------------

            📍 Location: {map_url}
            
            Time: {instance.timestamp.strftime('%Y-%m-%d %H:%M:%S')}

            Please take necessary action.

            - Smart Drive Alert System
            """

            from_email = getattr(settings, 'EMAIL_HOST_USER', 'noreply@smartdrive.com')
            admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@smartdrive.com')
            
            # Send to the admin and potentially the user themselves if needed
            recipient_list = [admin_email] 
            # If you want to send to the user too: recipient_list.append(instance.user.email)

            send_mail(
                subject,
                message,
                from_email,
                recipient_list,
                fail_silently=False,
            )
            print(f"📧 Email Alert Sent for {instance.alert_type} to {recipient_list}")

        except Exception as e:
            print(f"❌ Failed to send email alert: {e}")