FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x start.sh

EXPOSE 5000

#hopefully fixes line encoding issues with sh
ENV PYTHONUNBUFFERED=1
CMD ["bash", "-c", "python dbinit.py && flask run --host=0.0.0.0 --port=5000"] 

