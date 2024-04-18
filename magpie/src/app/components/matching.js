import { getFirestore, collection, getDocs } from "firebase/firestore";

// Weights for each question. Make sure these keys exactly match the question texts stored in Firestore.
const weights = {
  "What is your gender?": 5,
  "What's your major?": 3,
  "What is your current academic year status?": 5,
  "What residence hall would you prefer to move to?": 2,
  "Are you currently or willing to be involved in Greek life?": 1,
  "Are you involved in or planning to participate in varsity sports?": 1,
  "How clean do you intend to keep the room?": 3,
  "How close do you want to be with your roommate?": 4,
  "Are you comfortable with a roommate who drinks?": 3,
  "How often do you plan to invite people to your place?": 2,
  "How much noise are you comfortable with in your room?": 3,
  "What time do you sleep?": 2
};

function calculateMatch(user1, user2) {
  let score = 0;
  let totalWeight = 0;

  Object.keys(weights).forEach(question => {
    totalWeight += weights[question];
    const response1 = user1.responses[question];
    const response2 = user2.responses[question];

    console.log(`Comparing responses for ${question}:`, response1, response2); // Debugging output

    if (response1 && response2 && response1 === response2) {
      score += weights[question]; // Full points for exact match
    } else {
      // Add logic for partial matches if necessary
    }
  });

  const matchPercentage = (score / totalWeight) * 100; // Normalize to percentage
  console.log(`Total score for users ${user1.userId} and ${user2.userId}:`, matchPercentage);
  return matchPercentage;
}

export async function getMatchingScores(currentUserUID) {
  const db = getFirestore();
  const usersCollection = collection(db, "userResponses");
  const snapshot = await getDocs(usersCollection);
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const currentUser = users.find(user => user.userId === currentUserUID);

  if (!currentUser || !currentUser.responses) {
    console.error('Current user data or responses missing');
    return [];
  }

  const matchingScores = users.map(user => {
    if (user.responses) { // Ensure other user responses exist
      return {
        userId: user.userId,
        matchPercentage: calculateMatch(currentUser, user)
      };
    }
  }).filter(score => score && score.userId !== currentUserUID); // Exclude the current user and undefined scores

  return matchingScores;
}
