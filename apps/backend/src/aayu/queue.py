import json
import uuid

import boto3

from aayu.config import get_settings


def publish_job(job_id: uuid.UUID) -> None:
    settings = get_settings()
    if settings.job_queue_url:
        boto3.client("sqs", region_name=settings.aws_region).send_message(
            QueueUrl=settings.job_queue_url,
            MessageBody=json.dumps({"job_id": str(job_id)}),
        )
