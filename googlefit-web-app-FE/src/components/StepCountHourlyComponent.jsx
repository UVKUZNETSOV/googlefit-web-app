import React, { useState } from 'react';
import { Parser } from '@json2csv/plainjs';
import { saveAs } from 'file-saver';

const StepCountHourlyComponent = ({ accessToken }) => {
  const [stepCounts, setStepCounts] = useState([]);
  const [error, setError] = useState(null);

  const fetchStepCountsHourly = async () => {
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
                dataTypeName: 'com.google.step_count.delta',
              },
            ],
            startTimeMillis: new Date(`${new Date().getFullYear()}-0${new Date().getMonth()+1}-${new Date().getDate()}T00:00:00Z`).getTime(),
            endTimeMillis: new Date().getTime()
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch step count data');
      }

      const data = await response.json();

      if (data && data.bucket && data.bucket.length > 0) {
        const stepCountsData = data.bucket[0].dataset[0].point;
        if (stepCountsData && stepCountsData.length > 0) {
          const stepCountsArray = stepCountsData.map((point) => ({
            startTime: new Date(parseInt(point.startTimeNanos) / 1000000).toLocaleString(),
            endTime: new Date(parseInt(point.endTimeNanos) / 1000000).toLocaleString(),
            value: point.value[0].intVal,
          }));
          setStepCounts(stepCountsArray);
          sendDataToServer(stepCountsArray);
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
      saveAs(blob, 'step_count_data.csv');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button className='border-black border-solid border p-1 pr-4 pl-4 rounded-3xl ' onClick={fetchStepCountsHourly}>Шаги (объект)</button>
      {error && <p>Произошла ошибка: {error}</p>}
    </div>
  );
};

export default StepCountHourlyComponent;
