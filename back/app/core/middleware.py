import logging
import traceback

logger = logging.getLogger(__name__)

print("=" * 80)
print("MIDDLEWARE FILE LOADED")
print("=" * 80)

import re
from django.utils.deprecation import MiddlewareMixin

class CsrfExemptMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)

class OAuthDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        print("=" * 80)
        print("=== OAuthDebugMiddleware initialized ===")
        print("=" * 80)

    def __call__(self, request):
        if '/accounts/google/login/callback/' in request.path:
            print(f"=== OAuth Callback to {request.path} ===")
            
            from django.contrib.sites.models import Site
            try:
                site = Site.objects.get(id=1)
                print(f"Site ID=1 found: {site.domain}")
            except Site.DoesNotExist:
                print("ERROR: Site with ID=1 does not exist!")
            
            all_sites = list(Site.objects.values('id', 'domain'))
            print(f"All sites in DB: {all_sites}")
            
            # Check social app
            from allauth.socialaccount.models import SocialApp
            try:
                google_app = SocialApp.objects.get(provider='google')
                print(f"Google app found: client_id={google_app.client_id[:20]}...")
                print(f"Google app sites: {list(google_app.sites.values_list('domain', flat=True))}")
            except SocialApp.DoesNotExist:
                print("ERROR: Google Social App not found!")

        try:
            response = self.get_response(request)
        except Exception as e:
            print(f"ERROR in middleware: {e}")
            print(traceback.format_exc())
            raise
            
        return response
