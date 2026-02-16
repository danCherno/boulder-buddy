from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from allauth.socialaccount.signals import pre_social_login
import logging

logger = logging.getLogger(__name__)


@receiver(pre_social_login)
def log_new_user_login(sender, request, sociallogin, **kwargs):
    """
    Log when a user logs in via social auth.
    If it's a new user, log the total user count.
    """
    user = sociallogin.user
    
    # Check if this is a new user (not yet saved to database)
    if not user.pk:
        # User will be created after this signal
        # Get current count (before new user is added)
        current_count = User.objects.count()
        new_count = current_count + 1
        
        logger.info(
            f"🎉 NEW USER SIGNUP: {user.email or user.username} "
            f"(Total users: {new_count})"
        )
    else:
        # Existing user logging in
        logger.info(f"👤 User login: {user.email or user.username}")


@receiver(post_save, sender=User)
def log_user_created(sender, instance, created, **kwargs):
    """
    Also log when any user is created (catches non-OAuth signups too)
    """
    if created:
        total_users = User.objects.count()
        logger.info(
            f"✅ User created: {instance.email or instance.username} "
            f"(Total users: {total_users})"
        )