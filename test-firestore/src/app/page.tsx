// page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.js'; 
import { collection, getDocs } from 'firebase/firestore';
import { GeoPoint } from 'firebase-admin/firestore';
import '../../styles.css';


interface DataItem {
  city: string;
  state: string;
  location: GeoPoint;
}

const Page = () => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cities'));
        const dataList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as DataItem,
        }));
        setData(dataList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 style = {{textAlign: "center"}}>
        Data from Firestore</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.city}>
              <td>{item.city}</td>
              <td>{item.state}</td>
              <td>{item.location.latitude}</td>
              <td>{item.location.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/><br/><br/>
      <p>These are the only two cities I added to the database. Cool enough I got it working.</p>
    </div>
  );
  
  
}
export default Page;
