FROM python:3.9-slim
LABEL maintainer="Cherno"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/py/bin:$PATH"

WORKDIR /app
EXPOSE 8000

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt

ARG DEV=false

# ============================================
# System dependencies
# ============================================
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libpq-dev \
        libgl1 \
        libglib2.0-0 \
        && \
    # Install dependencies
    /py/bin/pip install -r /tmp/requirements.txt && \
    if [ "$DEV" = "true" ]; then \
        /py/bin/pip install -r /tmp/requirements.dev.txt; \
    fi && \
    # Cleanup
    apt-get purge -y gcc g++ && \
    apt-get autoremove -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp

# ============================================
# Non-root user
# ============================================
RUN useradd --no-create-home django-user

COPY ./app /app

USER django-user
