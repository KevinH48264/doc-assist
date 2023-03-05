FROM python:3.10

# Install libraries
COPY ./requirements.txt ./
RUN pip install -r requirements.txt && \
    rm ./requirements.txt

# Setup container directories
RUN mkdir /app

# load in model and tokenize
# COPY model.pkl /app
# COPY tokenizer.pkl /app
COPY main.py /app
COPY routes_url.py /app
COPY credentials.json /app
ADD /data /app
ADD /indices /app

WORKDIR /app

ENV PYTHONUNBUFFERED True

RUN rm -rf /root/.cache

CMD python main.py