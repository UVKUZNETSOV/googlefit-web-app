const Callories = (props) => {
  const accessToken = props.token;

  const fetchData = async () => {

    const url = `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`;

    const requestData = {
      aggregateBy: [{
        dataTypeName: 'com.google.calories.expended',
        dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
      }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: new Date(`${new Date().getFullYear()}-0${new Date().getMonth()+1}-${new Date().getDate()}T00:00:00Z`).getTime(),
      endTimeMillis: new Date().getTime()
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Callories:', Math.round(data.bucket[0].dataset[0].point[0].value[0].fpVal));
        localStorage.setItem("callories", Math.round(data.bucket[0].dataset[0].point[0].value[0].fpVal))
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button className="border-black border-solid border p-1 pr-4 pl-4 rounded-3xl" onClick={fetchData}>Данные о калориях</button>
    </div>
  );
};

export default Callories;

