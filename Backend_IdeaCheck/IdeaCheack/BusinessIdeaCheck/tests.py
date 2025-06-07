from django.test import TestCase
from django.contrib.auth.models import User
from BusinessIdeaCheck.models import BusinessIdea 
from User.models import UserProfile
class BusinessIdeaTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user( username="testuser" , email='test@gmail.com' , password='testuser' , is_active=True)
        self.profile = UserProfile.objects.create(user = self.user ,status='standart', role='entrepreneur',first_name='Test', last_name='User')
        self.client.login(username='testuser' , password ='testuser')

    def test_reateBusinessIdea(self):
        data = {
            "title":"Testtitle",
            "short_description":"Testshort_description",
            "target_audience":"Testtarget_audience",
            "problem":"testproblem",
            "solution":"testsolution",
            "pricing":"testpricing",
            "competitors":"testcompetitors",
            "channels": "vk"


        }
        idea = BusinessIdea.objects.create(user=self.profile , **data)

        self.assertEqual(idea.user , self.profile)
        self.assertEqual(idea.title , 'Testtitle')


    