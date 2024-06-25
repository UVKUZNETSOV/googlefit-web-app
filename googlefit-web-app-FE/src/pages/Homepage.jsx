import '../style/Homepage.css';
import logo from '../img/main-logo.png';
import background from '../img/background.png';
import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import Steps from '../components/steps'
import Callories from '../components/callories';
import LoginButton from '../components/login';
import call from '../components/call';
import HeartRateComponent from '../components/HeartRateComponent';
import HeartRateHourlyComponent from '../components/HeartRateHourlyComponent';
import StepCountHourlyComponent from '../components/StepCountHourlyComponent';
import CalorieHourlyComponent from '../components/CalorieHourlyComponent';

import RequestTemplate from '../components/shared/requestTemplate';

const CLIENT_ID = ""; // your CLIENT ID from google cloud console project
const API_KEY = ""; // your API KEY from google cloud console project

const SCOPE = "https://www.googleapis.com/auth/fitness.activity.read"; // change it if you need another data

const CLIENT_SECRET = ""; // your CLIENT SECRET from google cloud console project

function Homepage() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apikey: API_KEY,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        scope: SCOPE
      })
    }
    gapi.load('client:auth2', start);
  })

  function getAccess() {
    const access_token = gapi.auth.getToken().access_token;
    console.log(access_token)
    setAccessToken(access_token);
    const fetchData = async () => {
      try {
        await call(access_token);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${background})`}}>
      <main className='w-1/3'>
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="Logo" className="app__img"/>
          <h1 className="app__header">
            Google Fit Tracker
            <br/>
            <span>
              v2.0
            </span>
          </h1>
          <LoginButton />
        </div>

        <button className='data-btn mt-4' onClick={() => getAccess()}>Get data</button>

        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <Steps token={accessToken} />
          <StepCountHourlyComponent accessToken={accessToken}/>
          <Callories token={accessToken} />
          <CalorieHourlyComponent accessToken={accessToken} />
          <HeartRateComponent accessToken={accessToken} />
          <HeartRateHourlyComponent accessToken={accessToken} />
          <RequestTemplate 
            requestName="Calories"
            isObject={false}
            dataTypeName="com.google.calories.expended"
            dataSourceId="derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended"
            accessToken={accessToken}
          />
          <RequestTemplate 
            requestName="Steps"
            isObject={false}
            dataTypeName="com.google.step_count.delta"
            dataSourceId="derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            accessToken={accessToken}
          /> 
        </div>
        
      </main>
    </div>
  );

}

export { Homepage }

