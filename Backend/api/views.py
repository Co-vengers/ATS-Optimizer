from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ats_processing import start_processing
from .serializers import ResumeUploadSerializer, ResumeAnalysisSerializer
import os
import tempfile


class ATSScoreView(APIView):
    """
    API endpoint to calculate ATS score for a resume.
    Accepts: resume file (PDF) and job description (text)
    Returns: ATS score and missing skills
    """
    
    def post(self, request):
        # Step 1: Get the uploaded file and job description from request
        resume_file = request.FILES.get("resume")
        job_description = request.data.get("job_description")
        
        # Step 2: Validate the data using serializer
        serializer = ResumeUploadSerializer(data={
            "resume": resume_file,
            "job_description": job_description,
        })
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Step 3: Save to database
        analysis = serializer.save()
        
        # Step 4: Get file path (handles different storage backends)
        temp_file = None
        try:
            file_path = analysis.resume_file.path
        except:
            # If file path not available, create temporary file
            file_extension = os.path.splitext(analysis.resume_file.name)[1] or ".pdf"
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_extension)
            
            for chunk in resume_file.chunks():
                temp_file.write(chunk)
            temp_file.close()
            
            file_path = temp_file.name
        
        # Step 5: Process the resume and calculate ATS score
        try:
            ats_score, missing_skills = start_processing(file_path, job_description)
            
            # Step 6: Update database with results
            analysis.ats_score = ats_score
            analysis.missing_skills = missing_skills
            analysis.save()
            
        except Exception as e:
            return Response(
                {"detail": f"Error processing resume: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        finally:
            # Step 7: Clean up temporary file if created
            if temp_file:
                try:
                    os.unlink(temp_file.name)
                except:
                    pass
        
        # Step 8: Return the results
        result_serializer = ResumeAnalysisSerializer(analysis)
        return Response(result_serializer.data, status=status.HTTP_200_OK)