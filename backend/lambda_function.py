import json
import math
import os
from datetime import datetime, timezone

import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ.get("TABLE_NAME", "MessFlowResponses")
VALID_MEALS = {"breakfast", "lunch", "dinner"}
VALID_RESPONSES = {"YES", "NO"}

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }


def parse_body(event):
    body = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        import base64
        body = base64.b64decode(body).decode("utf-8")
    return json.loads(body)


def validate_date(date_string):
    try:
        datetime.strptime(date_string, "%Y-%m-%d")
        return True
    except (TypeError, ValueError):
        return False


def save_response(event):
    try:
        body = parse_body(event)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return response(400, {"message": "Request body must be valid JSON."})

    student_id = str(body.get("studentId", "")).strip().upper()
    date = str(body.get("date", "")).strip()
    meal = str(body.get("meal", "")).strip().lower()
    answer = str(body.get("response", "")).strip().upper()

    if not student_id or len(student_id) > 30:
        return response(400, {"message": "A valid studentId is required."})
    if not validate_date(date):
        return response(400, {"message": "date must use YYYY-MM-DD format."})
    if meal not in VALID_MEALS:
        return response(400, {"message": "meal must be breakfast, lunch, or dinner."})
    if answer not in VALID_RESPONSES:
        return response(400, {"message": "response must be YES or NO."})

    item = {
        "dateMeal": f"{date}#{meal}",
        "studentId": student_id,
        "date": date,
        "meal": meal,
        "response": answer,
        "updatedAt": datetime.now(timezone.utc).isoformat()
    }

    table.put_item(Item=item)

    return response(200, {
        "message": "Meal response saved.",
        "item": item
    })


def get_summary(event):
    query = event.get("queryStringParameters") or {}
    date = str(query.get("date", "")).strip()
    meal = str(query.get("meal", "")).strip().lower()

    if not validate_date(date):
        return response(400, {"message": "date query parameter must use YYYY-MM-DD format."})
    if meal not in VALID_MEALS:
        return response(400, {"message": "meal must be breakfast, lunch, or dinner."})

    date_meal = f"{date}#{meal}"

    result = table.query(
        KeyConditionExpression=Key("dateMeal").eq(date_meal)
    )
    items = result.get("Items", [])

    # More than enough for a mini-project. If a partition ever grows beyond
    # DynamoDB's 1 MB Query page, continue using LastEvaluatedKey.
    while "LastEvaluatedKey" in result:
        result = table.query(
            KeyConditionExpression=Key("dateMeal").eq(date_meal),
            ExclusiveStartKey=result["LastEvaluatedKey"]
        )
        items.extend(result.get("Items", []))

    yes = sum(1 for item in items if item.get("response") == "YES")
    no = sum(1 for item in items if item.get("response") == "NO")
    total = yes + no
    recommended = math.ceil(yes * 1.05)

    return response(200, {
        "date": date,
        "meal": meal,
        "yes": yes,
        "no": no,
        "total": total,
        "recommendedServings": recommended
    })


def lambda_handler(event, context):
    try:
        method = (
            event.get("requestContext", {})
                 .get("http", {})
                 .get("method", "")
                 .upper()
        )
        path = event.get("rawPath", "")

        if method == "POST" and path.endswith("/response"):
            return save_response(event)

        if method == "GET" and path.endswith("/summary"):
            return get_summary(event)

        return response(404, {"message": "Route not found."})

    except Exception as exc:
        print(f"Unhandled error: {exc}")
        return response(500, {"message": "Internal server error."})
