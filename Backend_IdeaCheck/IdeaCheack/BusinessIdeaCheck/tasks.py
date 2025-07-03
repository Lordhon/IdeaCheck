from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import requests
import json
from BusinessIdeaCheck.models import BusinessIdea
import os

api_key = os.getenv("OPENAI_API_KEY")

@shared_task
def ai_response_send(idea_id):
    idea = BusinessIdea.objects.get(id=idea_id)
    email = idea.user.user.email

    prompt = (
         
        f"Название: {idea.title}\n"
        f"Краткое описание: {idea.short_description}\n"
        f"Целевая аудитория: {idea.target_audience}\n"
        f"Проблема: {idea.problem}\n"
        f"Решение: {idea.solution}\n"
        f"Ценообразование: {idea.pricing}\n"
        f"Конкуренты: {idea.competitors}\n"
        f"Каналы продвижения: {idea.channels}\n\n"
        "Проанализируй и оцени бизнес идею. Укажи плюсы, минусы и рекомендации.")
    
    response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                        "Authorization": f"Bearer {api_key}",
                        "HTTP-Referer": "http://87.228.89.66",
                        "X-Title": "IdeaCheck",
                        "Content-Type": "application/json",
                    },
                    data=json.dumps({
                        "model": "deepseek/deepseek-r1:free",
                        "messages": [{"role": "user", "content": prompt}],
                    })
                )
    
             
    response.raise_for_status()
    ai_response = response.json()["choices"][0]["message"]["content"]


    send_mail(
            subject=f"AI-оценка вашей бизнес-идеи: {idea.title}",
            message=ai_response,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False
                )
    return "Письмо отправлено"
    
    
    
    
