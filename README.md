# Prototype health analytics fullstack web app using activity data from Google Fit using machine learning

---

## Application functionality

### Client side:

Authorization via Google account for further retrieval of activity data from fitness api, namely heart rate, steps and calories from the beginning of the day (00:00:00 AM) to the current moment with the ability to save data in dataset format locally on your computer. 

### Backend:

A model that combines all received datasets into one and preprocesses and analyzes the data to calculate a user's sleep periods, rest and activity periods, and average resting heart rate. 

---

## Used stack:

### Frontend:

- Vite + React
- JavaScript
- Tailwind
- Google OAuth 2.0
- Google Fit API

### Backend:

- Python

---

# Client

The task of the web application is to provide secure and convenient acquisition of human activity data and its appropriate structuring for subsequent processing. The architecture of our web application can be divided into several fundamental parts:

## Authentication and authorization of the user via Google account:

As part of the user authentication block, a functional component has been developed that works according to the present OAuth 2.0 protocol. In order for us to fully access the information we need about the user, we need the appropriate access parameters, which in turn are configured separately in the official Google Cloud console for developers.
In the console you need to authorize, create a project, name it and make a certain configuration:

First of all it is necessary to select a list of request headers with the help of which our client application will be able to access certain data, then add test users for whom authentication will be available and after successful configuration of the consent window, we can go to the credentials section, where it is also necessary to specify the URI from which requests to the server will be received during authentication and subsequent requests for activity (in our case, the developed web application is running on a local host https://localhost:3000). After all the above actions, we can get such parameters as client id and client secret, which in turn are the keys to our credentials.

At this stage it is already possible to receive some credentials about the user after successful authentication. One of the most important parameters for the mechanism of the web application are access token and refresh token, obtaining of which is also realized in the functional component. Using access token, we can get data about certain activities of a person by accessing fitness Api, which in turn should be properly configured.

To activate the API, we need to go to the official Google developer console again and select fitness API from the list of available APIs in the available APIs tab. It is required to activate this interface to get one more API key access parameter for successful validation of our application on Google servers during queries and obtaining the data we need for analysis (https://console.cloud.google.com/).

## Increasing the security level of the web application:

To increase the level of security in the operation of our client interface, we also switched to https protocol, for additional encryption of data when exchanging with servers. This ensures the exclusion of personal data leaks. Also according to the modern authorization standard, if the web application requires access to certain data, the user must independently provide access to them in the Google authorization window and confirm their consent to provide access.

## Obtaining user data:

Fitness API provides an opportunity to obtain both objective data, such as physical activity of a person, and subjective data, such as estimation of a person's mobility during the day, estimation of heart rate, which in turn are calculated by internal algorithms of the application. We are not interested in subjective data, because in order to process the data according to our developed algorithm, we will need the actual data that was received from a fitness bracelet or smart watch and recorded in the cloud.

Thus, we need data about user's activities such as steps, heartbeat, calories. To obtain this data, the user at this stage must be successfully authorized, because only after logging into the account and granting the necessary permissions, we will have the necessary credentials to implement requests to the server. Queries are written within different functional components, as we need to structure them for further processing in addition to receiving data.

In the software implementation of the above components, we developed a system of asynchronous POST requests to the server with headers corresponding to the activities according to the principle of using the start and end time point of the countdown, in our case it is 00:00:00:00 of the present day as the start point and the present moment as the end point. In this way we can retrieve all recorded activity data for the current day. In addition to the query, we also described the function of structuring the obtained data, which consists in collecting data into a single object with time stamps of records, which allows us to track the time of changes in activity values, as well as their correlation with other records.

In case there are indeed records about user's activities, all authorization stages have been passed, and there are no problems in our system of processing responses from the server, we receive in the response all records about the requested activities at the moment. In order for us to read, analyze and process this data, we need to convert the received object into a dataset, in our case the most convenient solution for this is conversion to csv format.

For all of the above, we have developed separate functions for querying the server, processing the received data according to the specified parameters (in our case, according to time stamps), saving the data in the form of object notation and converting the saved JSON object into a csv dataset.

Thus, to obtain and structure the activity data in total, three separate child components are implemented, which perform the functionality of requests to the server, processing the response and converting the obtained structured information into a dataset format for further data processing.

#### Here you can see preview of client side of application: https://uvkuznetsov.github.io/googlefit-web-app/

#### Image preview:

![Client preview](/googlefit-web-app-BE/img/preview.png)

---

# Backend

The purpose of data analysis is to determine the periods of a person's sleep, as well as the average resting heartbeat. Modern machine learning methods make it possible to determine such periods reliably enough and calculate the final average value on the basis of previously obtained records.

## Data preparation:

The data were collected from personal smart watches, which makes them objective for the study and it is possible to reconcile with personal real statistics of sleep periods. A period of eight days was chosen as the optimal time period for data processing. The number of records allows qualitative analysis of activity and physical indicators, as well as tracking of sleep periods.

To analyze and process the obtained activity data, appropriate data preprocessing is required. Initially, it is necessary to merge all generated datasets into a single one for further visualization and preliminary data analysis. It is also necessary to observe the time stamps and according to them to perform the merge correctly, for this purpose we bring all records in the column with time to the datetime format. After all records have been merged, output the resulting dataset and perform preliminary processing of records. Next, we determine the presence of empty and missing values. Since data on physical activities are written to the device asynchronously with different timestamps, the appearance of missing values is inevitable, respectively, such records must be excluded from the dataset. After rechecking the dataset for missing values, we can visualize the dynamics of physical activity on a graph using the matplotlib library.

![Data plot](/googlefit-web-app-BE/img/output-1.png "Fig.1")

In the graph (Fig. 1), one can visually pre-notice the correlation of physical indicators and at the initial stage assume which machine learning method will most accurately produce results.
Initially, it is required to record the sleep periods of a person. To do this, we need to determine the threshold value of heart rate during sleep. As a method of calculating this value, we will use the procentile method from the numpy library. We mark the column with heartbeat records and calculate the percentile of heart rate during sleep. During the experiments, the optimal value for the calculation was found.

In addition to the heartbeat, we also need a threshold of step values, which is the error of the fitness tracker recordings. This value was also calculated experimentally.

Total, after identifying and calculating the required thresholds of records, we mark the specific data with the sign of sleep or wakefulness depending on the values by the method of rules and calculate the periods of sleep in accordance with the prepared marks, and then visualize the obtained results in different graphs by marking the threshold value with a dotted line.


As a time interval for better clarity we will use a period of one day.

![Data per day](/googlefit-web-app-BE/img/output-2.png "Fig.2")

![Data per day](/googlefit-web-app-BE/img/output-3.png "Fig.3")

On these graphs (Fig. 2, Fig. 3) for different days we can clearly see the dynamics of heartbeat and steps, on the basis of which we can accurately determine the sleep periods of a person, as well as compare with the previously derived calculated calculated time intervals of sleep.
After successful determination of the person's sleep periods, the records during this time period can be excluded from the dataset to work with the data that were recorded during the guaranteed period of the person's wakefulness. To do this, we remove records with the sleep label from the dataset. In the end, we get a new dataset that can be processed by machine learning methods.

The clustering algorithm was used to find the level of similarity and difference of features. 

Before applying the algorithm, the data must be scaled. For this purpose, we will use the standardScaler method of the sklearn.preprocessing library. After all the data are scaled, we can apply the clustering algorithm to them. We will divide the data into two clusters, the activity sample and the rest sample, respectively. Then we can visualize the clusters, for this we will use the library seaborn.

![Clusters](/googlefit-web-app-BE/img/output-4.png "Fig.4")

The graphs (Fig. 4) show that there are enough records for this algorithm and the calculation of the average resting heart rate, respectively, can be determined by calculating the average heart rate from the data from the cluster responsible for the resting state of the person. After obtaining the results, it is additionally possible to perform a visual comparison with the heartbeat dynamics graph.

---

# Experimental results:

At the stage of testing the client part, authentication and authorization of test users was successful and secure, and the data received from the Google Fit API fully corresponded to the records from the application installed on the device associated with the smart watch that reads activity.

The algorithm developed for determining sleep periods showed quite accurate results, corresponding to reality on examples of several days with different sleep periods. Experimentally, we found the optimal parameter for calculating the percentile for calculating the heartbeat threshold, which we subsequently used to determine the periods.

Also, the algorithm for determining the average resting heartbeat value when compared with the dynamics of the total heart rate shows an accurate result. The reliability of the result was confirmed by comparing the calculations with personal observations. In my case, the algorithm calculated the average value of resting heart rate equal to 77.6 beats per minute. The clustering algorithm computed the results faster, more accurately, and less resource-intensive than other machine learning algorithms tested.

Since the algorithm was based on real accumulated data and showed sufficiently reliable results, it can be considered effective for the purposes of measuring human vital signs.

---

@ Work evaluated and approved by the RUDN committee in 2024