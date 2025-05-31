
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from BusinessIdeaCheck.views import CreateBusinessIdeaAI, GetMyIdea, GetIdea, GetIdeaPk, GetIdeaPkExpert, GetIdeaAVG
from Expert.views import CreateApplication, GetApplication , RejectApplications , ApproveApplications
from ExpertEvaluation.views import CreateEvaluation, ExpertEvaluationsByUser, ExpertEvaluationsByIdea, IdeaOverallRatingAPIView
from Investor.views import CreateApplicationInvestor, GetApplicationInvestor, ApproveApplicationsInvestor, \
    RejectApplicationsInvestor
from User.views import RegisterUser, ActivateUser, PasswordResetRequest, PasswordResetConfirm, MyProfile , CheckUserAPIView , UpdateUserAPIView

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/register/', RegisterUser.as_view()),
    path('api/login/' ,TokenObtainPairView.as_view()),
    path('api/user/activate/<uidb64>/<token>/', ActivateUser.as_view()),
    path('api/user/reset_password/<uidb64>/<token>/', PasswordResetConfirm.as_view()),
    path('api/reset_password/',PasswordResetRequest.as_view()),
    path('api/check-user/', CheckUserAPIView.as_view()),
    path('api/update-user-status/', UpdateUserAPIView.as_view()),
    


    path('api/IdeaCreate/',CreateBusinessIdeaAI.as_view()),
    path('api/MyIdea/', GetMyIdea.as_view()),
    path('api/account/', MyProfile.as_view()),
    path('api/idea/<int:pk>/', GetIdeaPk.as_view()),


    path('api/expert/applications/', CreateApplication.as_view()),
    path('api/expert/applications/get/', GetApplication.as_view()),
    path('api/expert/applications/<int:pk>/approve/', ApproveApplications.as_view()),
    path('api/expert/applications/<int:pk>/reject/', RejectApplications.as_view()),



    path('api/investor/applications/', CreateApplicationInvestor.as_view()),
    path('api/investor/applications/get/', GetApplicationInvestor.as_view()),
    path('api/investor/applications/<int:pk>/approve/', ApproveApplicationsInvestor.as_view()),
    path('api/investor/applications/<int:pk>/reject/', RejectApplicationsInvestor.as_view()),



    path('api/ideas/<int:idea_id>/evaluate/', CreateEvaluation.as_view()),
    path('api/ideas/evaluate/', ExpertEvaluationsByUser.as_view()),
    path('api/ideas/<int:idea_id>/evaluations/', ExpertEvaluationsByIdea.as_view()),
    path('api/ideas/<int:idea_id>/avg/', IdeaOverallRatingAPIView.as_view()),
    path('api/ideas/', GetIdea.as_view()),
    path('api/ideas/<int:pk>/', GetIdeaPkExpert.as_view()),
    path('api/ideas/investor/', GetIdeaAVG.as_view()),


















]
