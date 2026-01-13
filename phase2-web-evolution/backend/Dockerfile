# 3.10-slim use kar rahe hain taake build fast aur light ho
FROM python:3.10-slim

WORKDIR /code

# System dependencies (kuch libraries ko chahiye hoti hain)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Sab se pehle libraries install karein
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Pura backend folder copy karein
COPY . /code/

# Hugging Face port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]