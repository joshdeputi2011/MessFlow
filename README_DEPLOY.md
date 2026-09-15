# MessFlow — AWS Mini Project

## What is included

```
messflow/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── backend/
│   └── lambda_function.py
├── policies/
│   ├── lambda-dynamodb-policy.json
│   └── s3-public-read-policy.json
└── README_DEPLOY.md
```

The frontend works in **Demo Mode** before AWS is connected. Once API Gateway is ready, edit:

```js
const API_URL = "YOUR_API_GATEWAY_INVOKE_URL";
```

inside `frontend/app.js`.

---

# 1. Architecture

Browser → S3 static website → API Gateway HTTP API → Lambda → DynamoDB

Routes:

- `POST /response`
- `GET /summary?date=YYYY-MM-DD&meal=dinner`

DynamoDB table:

- Table name: `MessFlowResponses`
- Partition key: `dateMeal` (String)
- Sort key: `studentId` (String)

Example item:

```json
{
  "dateMeal": "2026-09-02#dinner",
  "studentId": "23BEE101",
  "date": "2026-09-02",
  "meal": "dinner",
  "response": "YES",
  "updatedAt": "2026-09-01T12:30:00+00:00"
}
```

---

# 2. Create DynamoDB table

1. Open **DynamoDB** in AWS Console.
2. Choose **Tables → Create table**.
3. Table name: `MessFlowResponses`.
4. Partition key: `dateMeal`, type **String**.
5. Sort key: `studentId`, type **String**.
6. Leave the remaining settings at their simple/default values for this mini-project.
7. Create the table.
8. Open the created table and copy its **Table ARN**. You will use it in the Lambda permission policy.

Why this key design?

`dateMeal + studentId` uniquely identifies one student's response to one meal. A second submission overwrites the same item instead of creating a duplicate.

---

# 3. Create the Lambda function

1. Open **AWS Lambda → Create function**.
2. Choose **Author from scratch**.
3. Function name: `MessFlowApi`.
4. Runtime: choose a currently supported **Python 3.x** runtime.
5. Architecture: default is fine.
6. Create the function.
7. Open the code editor.
8. Replace the starter code with the contents of `backend/lambda_function.py`.
9. Deploy the code.

## Lambda environment variable

Open **Configuration → Environment variables → Edit**.

Add:

- Key: `TABLE_NAME`
- Value: `MessFlowResponses`

Save.

---

# 4. Give Lambda permission to use DynamoDB

Lambda's execution role needs only two DynamoDB actions for this project: `PutItem` and `Query`.

1. Open your Lambda.
2. Go to **Configuration → Permissions**.
3. Click the execution role name to open IAM.
4. Add an inline policy.
5. Choose the JSON editor.
6. Copy `policies/lambda-dynamodb-policy.json`.
7. Replace:

`YOUR_DYNAMODB_TABLE_ARN`

with the actual ARN of `MessFlowResponses`.
8. Save the policy with a name such as `MessFlowDynamoDBPolicy`.

This is preferable to giving the Lambda full DynamoDB access.

---

# 5. Test Lambda before API Gateway

For the easiest end-to-end test, you can proceed to API Gateway and test using the real routes. If you want direct Lambda test events, use these examples.

POST test:

```json
{
  "version": "2.0",
  "rawPath": "/response",
  "requestContext": {
    "http": {
      "method": "POST"
    }
  },
  "body": "{\"studentId\":\"23BEE101\",\"date\":\"2026-09-02\",\"meal\":\"dinner\",\"response\":\"YES\"}",
  "isBase64Encoded": false
}
```

GET summary test:

```json
{
  "version": "2.0",
  "rawPath": "/summary",
  "requestContext": {
    "http": {
      "method": "GET"
    }
  },
  "queryStringParameters": {
    "date": "2026-09-02",
    "meal": "dinner"
  }
}
```

---

# 6. Create API Gateway HTTP API

Use an **HTTP API**, not a REST API, for this small project.

1. Open **API Gateway**.
2. Choose **Create API**.
3. Under **HTTP API**, choose **Build**.
4. Add an integration.
5. Select **Lambda**.
6. Choose the `MessFlowApi` Lambda.
7. Create the API with a name such as `MessFlowHTTPApi`.
8. Use the `$default` stage with automatic deployment if the console offers it.

## Routes

Create these two routes and connect both to the same Lambda:

- `POST /response`
- `GET /summary`

## CORS

Open the HTTP API's **CORS** settings and configure:

Allowed origins for your DA/demo:

```text
*
```

Allowed methods:

```text
GET
POST
OPTIONS
```

Allowed headers:

```text
content-type
```

For a classroom mini-project, `*` is convenient. If you later know your exact website origin, replace `*` with that origin.

Save the CORS configuration.

## Copy the Invoke URL

The API will have an invoke URL similar to:

```text
https://abc123.execute-api.ap-south-1.amazonaws.com
```

Copy it.

---

# 7. Connect the frontend to API Gateway

Open:

`frontend/app.js`

Change:

```js
const API_URL = "YOUR_API_GATEWAY_INVOKE_URL";
```

to your real URL, for example:

```js
const API_URL = "https://abc123.execute-api.ap-south-1.amazonaws.com";
```

Do not add a trailing slash.

Save the file.

---

# 8. Test the frontend locally

You can double-click `frontend/index.html`.

Before an API URL is configured, the app intentionally uses browser local storage as **Demo Mode**.

After the API URL is configured, it sends requests to AWS.

For the most realistic browser test, serve the folder with a local web server, for example:

```bash
cd frontend
python -m http.server 5500
```

Then open:

`http://localhost:5500`

---

# 9. Create the S3 frontend bucket

This is the simple S3 static-website method requested for the DA.

1. Open **Amazon S3**.
2. Create a general purpose bucket.
3. Give it a globally unique name, for example:

`messflow-yourname-2026`

4. Prefer the same AWS Region as the rest of the project.
5. Create the bucket.

## Upload frontend

Upload only these files from `frontend/` to the root of the bucket:

- `index.html`
- `styles.css`
- `app.js`

Do not upload the entire outer `messflow` folder if you want `index.html` at the website root.

---

# 10. Enable S3 static website hosting

1. Open the S3 bucket.
2. Go to **Properties**.
3. Scroll to **Static website hosting**.
4. Choose **Edit**.
5. Enable **Use this bucket to host a website**.
6. Index document: `index.html`.
7. Save.

AWS will display a **Bucket website endpoint**.

Important: direct S3 website endpoints use HTTP rather than HTTPS. For a classroom demo this is the minimal setup. For a production system, prefer CloudFront or another secure hosting approach.

---

# 11. Make the S3 website readable for the demo

Public S3 website hosting requires public read access to the website objects.

For this classroom/demo bucket only:

1. Open **Permissions** for the bucket.
2. Edit **Block public access** as needed to permit a public website.
3. Confirm the warning.
4. Open **Bucket policy**.
5. Copy `policies/s3-public-read-policy.json`.
6. Replace `YOUR_BUCKET_NAME` with your actual bucket name.
7. Save.

Do not upload credentials, secrets, private documents, or sensitive data to this public bucket.

---

# 12. Open the S3 website endpoint

Open the website endpoint shown under:

**S3 → bucket → Properties → Static website hosting**

The top-right status should now say:

`AWS CONNECTED`

instead of:

`DEMO MODE`

---

# 13. Demo sequence for your DA

Use this exact flow in your demonstration:

1. Open the **Student response** page.
2. Enter `23BEE101`.
3. Select tomorrow.
4. Select Dinner.
5. Choose **YES**.
6. Submit.
7. Repeat with a few registration numbers and both YES and NO.
8. Open **Mess dashboard**.
9. Choose the same date and Dinner.
10. Click Refresh.
11. Show:
   - YES count
   - NO count
   - total responses
   - recommended servings
12. Open DynamoDB in another tab and show the stored records.
13. Briefly show Lambda and API Gateway to explain the cloud flow.

---

# 14. Project explanation for viva

## Problem

Hostel and college mess kitchens often prepare food using expected population rather than confirmed meal demand. Students may skip meals, go home, eat outside, or order food, which can lead to avoidable over-preparation and food wastage.

## Solution

MessFlow allows students to confirm whether they plan to attend a meal. The responses are stored in a serverless AWS backend and aggregated for the mess administrator. The dashboard recommends a preparation quantity using confirmed YES responses plus a small 5% safety buffer.

## Why cloud?

- The frontend is centrally available from S3.
- API Gateway exposes the backend securely through HTTP endpoints.
- Lambda provides serverless request processing.
- DynamoDB provides managed NoSQL storage.
- No EC2 server has to run continuously.

## Formula

```text
Recommended servings = ceil(YES responses × 1.05)
```

Example:

```text
YES responses = 372
372 × 1.05 = 390.6
Recommended = 391 servings
```

---

# 15. Important limitations to mention honestly

This mini-project intentionally does not include:

- Login/authentication
- Student roster verification
- Meal cutoff enforcement
- Notifications
- Historical forecasting
- Actual food-waste measurements

Those are future enhancements, not missing requirements for the basic DA.

A future version could add Cognito authentication, SNS notifications, historical analytics, or waste feedback.

---

# 16. Cleanup after assessment

To avoid leaving unused cloud resources:

1. Delete the S3 website bucket if you no longer need it.
2. Delete the API Gateway API.
3. Delete the Lambda function.
4. Delete the DynamoDB table.

Also use AWS Billing/Budgets to keep an eye on usage. Free-tier and promotional allowances can change, so do not assume every resource is permanently free.
