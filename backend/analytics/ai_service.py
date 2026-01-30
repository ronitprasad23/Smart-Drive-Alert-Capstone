import os
import google.generativeai as genai
from django.conf import settings

def generate_safety_feedback(trip_instance, alerts_queryset):
    """
    Generates AI feedback using Google Gemini API.
    """
    
    # 1. Gather Context Data
    distance = trip_instance.distance_km
    
    high_severity_count = alerts_queryset.filter(severity__in=['HIGH', 'CRITICAL']).count()
    drowsiness_count = alerts_queryset.filter(alert_type__name__icontains='Drowsiness').count()
    speeding_count = alerts_queryset.filter(alert_type__name__icontains='Speeding').count()
    
    # 2. Construct Prompt
    prompt = f"""
    You are an AI Driving Safety Coach. Analyze this trip:
    - Distance: {distance} km
    - High Severity Alerts: {high_severity_count}
    - Drowsiness Events: {drowsiness_count}
    - Speeding Events: {speeding_count}
    
    Provide 2 short, helpful sentences of feedback to the driver. Focus on safety and improvement.
    """

    # 3. Call Gemini API
    api_key = os.environ.get("GEMINI_API_KEY") 
    
    if not api_key:
        return "AI Configuration Error: GEMINI_API_KEY not found. Please add it to your environment variables."

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Service Error: {str(e)}"
