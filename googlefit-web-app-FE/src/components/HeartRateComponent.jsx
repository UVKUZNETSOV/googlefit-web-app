import React from 'react';

const HeartRateHourlyComponent = ({ accessToken }) => {
  const fetchHeartRatesHourly = async () => {
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
                dataTypeName: 'com.google.heart_rate.bpm',
                bucketByTime: { durationMillis: 3600000 }, 
              },
            ],
            startTimeMillis: new Date(`${new Date().getFullYear()}-0${new Date().getMonth()+1}-${new Date().getDate()}T00:00:00Z`).getTime(),
            endTimeMillis: new Date().getTime()
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch heart rate data');
      }

      const data = await response.json();

      if (data && data.bucket && data.bucket.length > 0) {
        const heartRatesData = data.bucket[0].dataset[0].point;
        if (heartRatesData && heartRatesData.length > 0) {
          heartRatesData.forEach((point) => {
            const startTime = new Date(parseInt(point.startTimeNanos) / 1000000).toLocaleString();
            const endTime = new Date(parseInt(point.endTimeNanos) / 1000000).toLocaleString();
            const value = point.value[0].fpVal;
            console.log(`Время начала: ${startTime}, Время конца: ${endTime}, Пульс: ${value} ударов в минуту`);
          });
        }
      } else {
        console.log('Данные отсутствуют');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <button className='border-black border-solid border p-1 pr-4 pl-4 rounded-3xl' onClick={fetchHeartRatesHourly}>Данные о сердцебиении</button>
  );
};

export default HeartRateHourlyComponent;
