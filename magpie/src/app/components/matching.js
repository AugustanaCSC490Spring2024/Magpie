import { getFirestore, collection, getDocs } from "firebase/firestore";

const weights = {
  "What is your gender?": 5,
  "What's your major?": 3,
  "What is your current academic year status?": 5,
  "What residence hall would you prefer to move to?": 2,
  "Are you currently or willing to be involved in Greek life?": 1,
  "Are you involved in or planning to participate in varsity sports?": 1,
  "How clean do you intend to keep the room?": 3,
  "How close do you want to be with your roommate?": 4,
  "Are you comfortable with a roommate who drinks?": 4,
  "How often do you plan to invite people to your place?": 3,
  "How much noise are you comfortable with in your room?": 3,
  "What time do you sleep?": 3
};

function similarityScore(option1, option2, options) {
  // Calculate similarity based on the proximity of options in the predefined order
  const index1 = options.indexOf(option1);
  const index2 = options.indexOf(option2);
  if (index1 === -1 || index2 === -1) return 0; // If option is not in the list
  const maxDistance = options.length - 1;
  const distance = Math.abs(index1 - index2);
  return (maxDistance - distance) / maxDistance; // Normalized similarity score
}

function calculateMatch(user1, user2, questions) {
  let score = 0;
  let totalWeight = 0;

  Object.keys(weights).forEach(question => {
    const questionOptions = questions.find(q => q.questionText === question).options;
    totalWeight += weights[question];
    const response1 = user1.responses[question];
    const response2 = user2.responses[question];

    if (response1 && response2) {
      if (response1 === response2) {
        score += weights[question]; // Full points for exact match
      } else {
        // Different handling based on the type of question
        if (questionOptions.length > 3) { // Assuming binary or very limited options
          // Calculate partial match score for other questions
          const partialScore = similarityScore(response1, response2, questionOptions) * weights[question];
          score += partialScore;
        }
      }
    }
  });

  const matchPercentage = (score / totalWeight) * 100; // Normalize to percentage
  return matchPercentage;
}


export async function getMatchingScores(currentUserUID) {
  const db = getFirestore();
  const usersCollection = collection(db, "userResponses");
  const questionsCollection = collection(db, "onboardingQuestions");
  const snapshot = await getDocs(usersCollection);
  const questionSnapshot = await getDocs(questionsCollection);
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const questions = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const currentUser = users.find(user => user.userId === currentUserUID);

  if (!currentUser || !currentUser.responses) {
    console.error('Current user data or responses missing');
    return [];
  }

  const matchingScores = users.map(user => {
    if (user.responses) { // Ensure other user responses exist
      return {
        userId: user.userId,
        matchPercentage: calculateMatch(currentUser, user, questions)
      };
    }
  }).filter(score => score && score.userId !== currentUserUID); // Exclude the current user and undefined scores

  return matchingScores;
}
