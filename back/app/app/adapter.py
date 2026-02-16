from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_login_redirect_url(self, request):
        is_popup = request.session.get('is_popup_login', False)
        
        if is_popup:
            request.session.pop('is_popup_login', None)
            return '/api/auth/popup-close/'
        
        return settings.LOGIN_REDIRECT_URL