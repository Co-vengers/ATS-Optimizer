from django.db import models

# Create your models here.
class ResumeAnalysis(models.Model):
    # This automatically saves files to 'media/resumes/'
    resume_file = models.FileField(upload_to='resumes/') 
    job_description = models.TextField()
    ats_score = models.FloatField(null=True, blank=True)
    # Stores missing skills as a JSON array
    missing_skills = models.JSONField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume {self.id} - Score: {self.ats_score}"