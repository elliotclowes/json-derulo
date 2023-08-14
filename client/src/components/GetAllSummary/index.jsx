import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../../firebase-config';

const UserSummariesPage = () => {
  const { userId } = useParams(); 

  const [userSummaries, setUserSummaries] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserSummaries = async () => {
      const q = query(collection(db, 'summaries'), where('userID', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const summaries = [];
      querySnapshot.forEach((doc) => {
        summaries.push({ id: doc.id, ...doc.data() });
      });

      setUserSummaries(summaries);
    };

    fetchUserSummaries();
  }, [db, userId]);

  return (
    <div>
      <h1>User Summaries</h1>
      <ul>
        {userSummaries.map((summary) => (
          <li key={summary.id}>
            <h2>{summary.title}</h2>
            <p>Visibility: {summary.visibility}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSummariesPage;