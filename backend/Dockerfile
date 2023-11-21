FROM python:3.12
WORKDIR /backend
COPY ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY . .
CMD [ "gunicorn", "--bind", "localhost:5000", "app.app:create_app()"]