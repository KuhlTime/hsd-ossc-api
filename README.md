<p align="center">
  <img src="./assets/banner.png" alt="Banner" max-height="240px">
</p>

This is an API Server to easly get grades and exam data from the OSSC grades server. The API uses Firebase as a backend in order to store none user related information about the exams, scraped from the website.

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%203.svg)](https://www.digitalocean.com/?refcode=850a4eba40bb&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

## 🛣 Concept

Here you can see a flow diagram on how to retrive the students grades and the scores of each exam from the OSSC site. Each box represents a single HTTP Request. Each request depends on information from the previous request.
![Request Flowchart](assets/request-flow.png)

## 👩‍💻 Setup

In order to use the API you can either deploy the code on a PaaS (e.g. [Heroku](https://heroku.com)) or try it out locally.

### 👾 Environment Variables

- `FIREBASE_SERVICE_ACCOUNT_BASE64`: This variable holds a Base64 encoded string of the service account json file, you can download from you firebase console. To encode the file use the following shell command:

	```sh
  cat serviceAccountKey.json | base64
	```
- `SENTRY_DSN`: In case you want to enable debugging using [Sentry.io](https://sentry.io) you can provide your DSN to this variable.

### ⛴ Docker

```sh
docker run\
  --name node-ossc\
  -e NODE_ENV="production"\
  -e FIREBASE_SERVICE_ACCOUNT_BASE64=""\
  -e SENTRY_DSN=""\
  -p 80:8080\
  ghcr.io/kuhltime/hsd-ossc-api:latest
```

## 🌈 Endpoints

🚨 **IMPORTANT: Any confidential data should never transmitted over unencrypted `http` but instead be transmitted over `https`**

[GET `/`](https://ossc.api.kuhlti.me/): This is the production endpoint. Requests made to this url will result in the server performing the request on the ossc website. This route requires valid login credentials. In order to send these you need to specify the `Authorization` header inside your HTTP request. The value of which has to be formatted as follows (pseudo-code):

```sh
Authorization: Basic $base64Encode($username + ':' + $password)
```

[GET `/ossc`](https://ossc.api.kuhlti.me/test): In order to reduce the stress on the ossc server, while developing, you can use this endpoint to get a boilerplate of the data you can expect from the production endpoint.

[GET `/data`](https://ossc.api.kuhlti.me/data): This Endpoint returns all data I store inside my database. I only store none user related information such as the date of each exam and the final result, which only contains the overview of how many students recieved a particular garde.

## 👨‍⚖️ Disclaimer

I will not take any responsibility for any malfunctions or consequences that may arise from using this tool. For the development of this tool I used the following ressource: [Notenspiegel vom Prüfungsamt abrufen (QIS)](https://www.python-forum.de/viewtopic.php?t=9870)
