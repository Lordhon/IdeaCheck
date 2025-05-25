from rest_framework.permissions import BasePermission

class IsExpertOrInvestor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == 'expert' or request.user.role == 'investor')
