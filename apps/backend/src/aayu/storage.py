from pathlib import Path

import boto3
from botocore.exceptions import ClientError

from aayu.config import get_settings


def upload_url(object_key: str, content_type: str, fallback_url: str) -> str:
    settings = get_settings()
    if not settings.document_bucket:
        return fallback_url
    return boto3.client("s3", region_name=settings.aws_region).generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.document_bucket,
            "Key": object_key,
            "ContentType": content_type,
        },
        ExpiresIn=300,
    )


def write_dev_upload(object_key: str, body: bytes) -> None:
    path = Path("/tmp/aayu-uploads") / object_key
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(body)


def upload_exists(object_key: str) -> bool:
    settings = get_settings()
    if not settings.document_bucket:
        return (Path("/tmp/aayu-uploads") / object_key).is_file()
    try:
        boto3.client("s3", region_name=settings.aws_region).head_object(
            Bucket=settings.document_bucket, Key=object_key
        )
    except ClientError:
        return False
    return True
