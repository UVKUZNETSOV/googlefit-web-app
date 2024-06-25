import React, { useState } from 'react';
import { Parser } from '@json2csv/plainjs';
import { saveAs } from 'file-saver';

const CalorieHourlyComponent = ({ accessToken }) => {
  const [calories, setCalories] = useState([]);
  const [error, setError] = useState(null);

  const fetchCaloriesHourly = async () => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aggregateBy: [
              {
                dataTypeName: 'com.google.calories.expended',
                dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
              },
            ],
            startTimeMillis: new Date(`${new Date().getFullYear()}-0${new Date().getMonth()+1}-${new Date().getDate()}T00:00:00Z`).getTime(),
            endTimeMillis: new Date().getTime()
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calorie data');
      }

      const data = await response.json();

      if (data && data.bucket && data.bucket.length > 0) {
        const caloriesData = data.bucket[0].dataset[0].point;
        if (caloriesData && caloriesData.length > 0) {
          const caloriesArray = caloriesData.map((point) => ({
            startTime: new Date(parseInt(point.startTimeNanos) / 1000000).toLocaleString(),
            endTime: new Date(parseInt(point.endTimeNanos) / 1000000).toLocaleString(),
            value: point.value[0].fpVal,
          }));
          setCalories(caloriesArray);
          sendDataToServer(caloriesArray);
        } else {
          console.log('Данные отсутствуют');
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const sendDataToServer = (data) => {
    console.log(data);
    try {
      const parser = new Parser();
      const csv = parser.parse(data);
      console.log(csv);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'calorie_data.csv');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button className='border-black border-solid border p-1 pr-4 pl-4 rounded-3xl ' onClick={fetchCaloriesHourly}>Калории (объект)</button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default CalorieHourlyComponent;
