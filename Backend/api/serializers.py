from rest_framework import serializers
from .models import ResumeAnalysis
import os

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    resume_file = serializers.FileField(required=True)
    missing_skills = serializers.ListField(
        child=serializers.CharField(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = ResumeAnalysis
        fields = ["id", "resume_file", "job_description", "ats_score", "missing_skills", "uploaded_at"]
        read_only_fields = ["id", "ats_score", "missing_skills", "uploaded_at"]


class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField()
    job_description = serializers.CharField()

    def validate_resume(self, value):
        # simple PDF check; adjust if you allow other formats
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in [".pdf"]:
            raise serializers.ValidationError("Only PDF resumes are allowed.")
        return value

    def create(self, validated_data):
        return ResumeAnalysis.objects.create(
            resume_file=validated_data["resume"],
            job_description=validated_data["job_description"]
        )