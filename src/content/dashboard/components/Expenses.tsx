import {
    Card,
    CardHeader,
    Divider
  } from '@mui/material';

import axios from 'axios';
import { useEffect, useState } from 'react';  
import Chart from 'react-google-charts';
import { getCookie } from 'src/utils/cookies';

function getCount(data) {

    // `map` out the data by type
    const typeArr = data.map((object) => object.categories[0]); 

    // Iterate over the type data. We pass in an initial
    // object to capture the counts, so we need to use
    // `Object.values` to grab the object values at the end
    // of the iteration
    return Object.values(typeArr.reduce((acc, id) => {
  
      // If the key doesn't exist in the accumulator object
      // create it and create a new array at its value
      acc[id] = acc[id] || [id, 0];
  
      // Increment the second index (the count)
      acc[id][1]++;
  
      // Return the object for the next iteration
      return acc;
    }, {}));
  }

function Expenses() {
    const [expenseCategories, setExpenseCategories] = useState([]);

    const pieData = [
        ['Expense Category', 'Amount per Category'],
        ...expenseCategories
    ]
    
    const pieOptions = {
      // title: 'Total Expense Breakdown',
      legend: { position: 'bottom', alignment: 'end' },
      is3D: true,
      alignment: 'center',
    }

    useEffect(() => {
        // retrieves the transactions from the user
        axios.get('/api/transactions', {
            headers: {
                authorization: 'Bearer ' + getCookie(document.cookie, "auth_token"),
            }
            }).then((response) => {
                setExpenseCategories(getCount(response.data));
        })
    }, []);
  
    return (
      <Card>
        <CardHeader title="Expenses" />
        <Divider />
        <Chart
          width={'900px'}
          height={'450px'}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={pieData}
          options={pieOptions}
          rootProps={{ 'data-testid': '3' }}
        />
      </Card>
    );
  }
  
  export default Expenses;
  